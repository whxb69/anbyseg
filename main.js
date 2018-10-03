define([
    "base/js/namespace",
    "jquery"
], function (IPython, $) {
    "use strict";

    var seg = function(){
      var cells = IPython.notebook.get_cells();
      var c = 0;
      var len = cells.length;
      IPython.notebook.select(0);
      while(c < len){
      if(cells[c].cell_type == 'markdown'){
         IPython.notebook.select(c);
         var text = cells[c].get_text();
         var temp = text.split('。');

         for(var j = 0;j < temp.length;j++){
          if(temp[j] == ""){
            temp.splice(j,1);
            j = j - 1;
          }
         }

         if(temp.length > 1 && temp != ["", ""]){
          cells[c].set_text(temp[0] + '。');
          cells[c].execute();
          for (var i = 1;i < temp.length;i++){
            var cell = IPython.notebook.insert_cell_below('markdown');
            cell.set_text(temp[i] + '。');
            cell.execute();
            var t = IPython.notebook.find_cell_index(cell);
            IPython.notebook.select(t);

         }
         cell = IPython.notebook.insert_cell_below('markdown');
         cell.set_text('<br>');
         cell.execute();
        }
      }
      c = c + 1;
      cells = IPython.notebook.get_cells();
      len = cells.length;
    }
    cells = IPython.notebook.get_cells();
    for(var ii = 0;ii < cells.length - 1;ii++){
      if(cells[ii].get_text() == '<br>' && cells[ii + 1].get_text() == '<br>'){
        IPython.notebook.delete_cell(ii + 1);
        cells = IPython.notebook.get_cells();
      }
    }
    cells = IPython.notebook.get_cells();
    for(var ii = 0;ii < cells.length;ii++){
      if(cells[ii].get_text() == '<br>。'){
        IPython.notebook.delete_cell(ii);
        cells = IPython.notebook.get_cells();
      }
    }
    };

  var merge = function () {
      var cur = IPython.notebook.get_selected_cell();
      var curi = IPython.notebook.find_cell_index(cur);
      var cells = IPython.notebook.get_cells();

      if(cur.cell_type != 'markdown'){
      	return;
      }

      var prei = 0;
      if(curi != 0){
        if(cells[curi - 1].cell_type == 'markdown' && cells[curi - 1].get_text() != '<br>'){
          var pre = cells[curi - 1];
          prei = curi - 1;



          while(prei > 0 && cells[prei - 1].get_text() != '<br>' && cells[prei - 1].cell_type == 'markdown'){
          pre = cells[prei];
          prei = prei - 1;
          }
        }else{
          prei = curi;
        }
      }

      var nxti = cells.length - 1;
      if(curi != cells.length - 1){
      if(cells[curi + 1].cell_type == 'markdown'){
        var nxt = cells[curi + 1];
        nxti = curi + 1;
      }


      while(nxti < cells.length - 1 && cells[nxti + 1].get_text() != '<br>' && cells[nxti + 1].cell_type == 'markdown'){
        nxt = cells[nxti];
        nxti = nxti + 1;
      }
    }else{
      nxti = cells.length - 1;
    }

    console.log(prei);
    console.log(nxti);

    var indexs =  [];
    var preii = prei;
    indexs.push(preii);
    while(preii < nxti){
      preii = preii + 1;
      indexs.push(preii);
    }

    console.log(indexs);
    IPython.notebook.merge_cells(indexs, true);

    cells = IPython.notebook.get_cells();
    var text = cells[prei].get_text();
    console.log(text);
    var temp = text.split('↵↵');
    console.log(temp);
    // for (var i = 0;i < temp.length - 1;i++){
    //   result = result + temp[i];
    // }
    var result = temp[0].replace(/↵↵/g,'')
    result = result.replace(/[\n]/g, "");
    console.log(result)
    cells[prei].set_text(result);
    cells[prei].execute();





  };

  var load_ipython_extension = function () {
        IPython.toolbar.add_buttons_group([
            IPython.keyboard_manager.actions.register ({
                help   : 'segment the sentences',
                icon   : 'fa-minus-square-o',
                handler : seg
            }, 'anbyseg', 'segment'),
            Jupyter.keyboard_manager.actions.register({
                    'help'   : 'merge',
                    'icon'   : 'fa-plus-square-o',
                    'handler': merge //translateToolbar
            }, 'merge', 'merge'),
        ]);
    };

  var extension = {
        load_ipython_extension : load_ipython_extension,
    };
    return extension;
});
