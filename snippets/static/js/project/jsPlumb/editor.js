/**
 * Created by caoxiang.
 */
function Editor() {
    this.pannel = function (isHide) {
        var str = ' <div class="panel'
        if (isHide)
            str += ' hide'
        str += '">';
        return str;
    };
    this.smallIcon = function () {
        var str = ' <span class="glyphicon glyphicon-chevron-right" style="float: left;margin-right:10px;"></span>';
        return str;
    };

   //折叠连接
    this.pannelLabel = function (label, id) {
        var str = '<h4 class="panel-title">'
            + '<a data-toggle="collapse" data-parent="#accordion" style="display: block;"'
            + 'href="#' + id + '">' + label
            + '   </a>'
            + ' </h4>';
        return str;

    };

    //给属性列表的节点添加标签 并把节点的id赋值到此 id的值为节点id+index
    this.pannelBody = function (id, content) {
        var str = '<div id="' + id + '" class="panel-collapse collapse">'
            + '<div class="panel-body">'
            + content
            + '</div>'
            + '</div>';
        return str;
    };
	
	Array.prototype.contains = function(obj) {
			var i = this.length;
			while (i--) {
				if (this[i] == obj)                 {
				return true;
				}
			}
			return false;
		};
	
    this.select = function (prop) {
        //Todo 对于选择框实现 考虑把所有数据都保存到prop.value字段中 通过解析该字段展示不同的内容
        //暂时没实现字段的解析
        
		var val = prop.value;
        var editor = prop.editor;
        var id = prop.id;
		
        //判断json有没有
		
        //var data = editorMethod[prop.initEvent]();
		var clustering_data = ["","datingTestSet","datingTestSet2"]
		var classify_data = ["","testSet","testSet2","diabetes"]
		if (save_selected != ''){
			if (clustering_data.contains(save_selected['data'])){
				
				clustering_data[0]=save_selected['data'];
				for (var n=1;n<clustering_data.length;n++){
				
					if(clustering_data[n]==clustering_data[0]){
					
						clustering_data.splice(n,1);
					
					}
				}
			}
			
			if (classify_data.contains(save_selected['data'])){
				
				classify_data[0]=save_selected['data'];
				for (var n=1;n< classify_data.length;n++){
				
					if( classify_data[n]== classify_data[0]){
					
						 classify_data.splice(n,1);
					
					}
				}
			}
			
		}
		
        var select_str = '<div class="editor"> ' +'<font>聚类：</font>'+'<select name="clustering" id="'+id+'" style="width : 100%" ';
        
        select_str+='editor="'+editor+'" onclick="setCookie("'+id+'",this.selectedIndex)">';
					
		for(var i=0;i<clustering_data.length;i++)
		{
            select_str+='<option value="'+clustering_data[i]+'">'+clustering_data[i]+'</option>';
        }
		select_str+='</select></div>';
		
		select_str+='<div class="editor"> ' +'<font>分类：</font>'+'<select name="classify" id="'+id+'" style="width : 100%" ';
        
        select_str+='editor="'+editor+'" onclick="setCookie("'+id+'",this.selectedIndex)">';
					
		for(var i=0;i<classify_data.length;i++)
		{
            select_str+='<option value="'+classify_data[i]+'">'+classify_data[i]+'</option>';
        }
		select_str+='</select></div>';
		
        return select_str;
    };
	

	this.input = function (prop) {
			var val =  prop.value;
			var editor =   prop.editor;	
			var name =   prop.name;
			var id =   prop.id;
			var str = '<div class="editor">'+ '<input type="text" class="form-control" id="'+id+'" editor="' + editor + '"';
			if (name != null || name != '') {
				str += 'name ="'
				str += name;
				str += '" '
			}
			str += 'style="width:100%;" ';
			if (val != null || val != '') {
				str += 'value="'
				str += val;
				str += '" ';
			}
			str += '>'
			str += ' </div>';
			return str;
		};
	
	this.checkbox = function (prop) {
        //存储被选中checkbox的个数以及value值
		
		
		if(localStorage['length']!='0'){
			//console.log(localStorage);
			var str = '<div class="editor">';	
			for(var i=0;i<r.length;i++){
				var attribute = r[i];
				var judge='True';
				
				for(var n=0;n<parseInt(localStorage['length'])-1;n++){
						
					if (localStorage[n]==attribute){
						str+='<div class="check"><input type="checkbox"  id="'+attribute+'" value="'+attribute+'" checked><label for="'+attribute+'">'+attribute+'</label></div>';
						judge='False';
						
						
								
					}
				}
				
				if(judge=='True'){
					str+='<div class="check"><input type="checkbox"  id="'+attribute+'" value="'+attribute+'"><label for="'+attribute+'">'+attribute+'</label></div>';
				}
				
			}	
					
		}
		
		else{
			var str = '<div class="editor">';
			str += data_selected;
			str+='</div>';
		}
		
		return str;
    };
	
	
	this.normalization = function (prop) {
		var str = '<div class="editor">';
		str += '<div class="normal"><input  type="button"  value="显示归一化数据"></div>';
		str+='</div>';
		return str;
	}
	
	this.pca = function (prop) {
		var str = '<div class="editor">';
		str += '<div class="pca"><input  type="button"  value="显示PCA数据"></div>';
		str+='</div>';
		return str;
	}
	
	//随机森林
	this.randomForest = function(prop){
		var val = prop.value;
		var editor = prop.editor;	
		var name = prop.name;
		var id = prop.id;
		var str = '<div class="editor">'+ '<input type="text" class="form-control" id="'+id+'" editor="' + editor + '"';
		if (name != null || name != '') {
			if (name == 'selectField'){
				str += 'name ="'
				str += name;
				str += '" '
				str += 'value ="'
				for(var n=0;n<parseInt(localStorage['length'])-1;n++){
					if (localStorage[n]!='result')
					str+= (localStorage[n]+";")					
					}	
				str += '" '
			}
			
			if (name == 'labelField'){
				str += 'name ="'
				str += name;
				str += '" '
				str += 'value ="'
				for(var i=0;i<r.length;i++){
					var attribute = r[i];
					if (attribute=='result'){
						str += attribute;
					}
				
				}					
				str += '" '
			}
			
			else{
				str += 'name ="'
				str += name;
				str += '" '
			}
		}
		
		str += 'style="width:100%;" ';
		if (val != null || val != '') {
			str += 'value="'
			str += val;
			str += '" ';
		}
		str += '>'
		str += ' </div>';
		return str;
	};
	
	
	//朴素贝叶斯
	this.bayes = function(prop){
		var val = prop.value;
		var editor = prop.editor;	
		var name = prop.name;
		var id = prop.id;
		var str = '<div class="editor">'+ '<input type="text" class="form-control" id="'+id+'" editor="' + editor + '"';
		if (name != null || name != '') {
			if (name == 'selectField'){
				str += 'name ="'
				str += name;
				str += '" '
				str += 'value ="'
				for(var n=0;n<parseInt(localStorage['length'])-1;n++){
					if (localStorage[n]!='结果')
					str+= (localStorage[n]+";")					
					}	
				str += '" '
			}
			
			if (name == 'labelField'){
				str += 'name ="'
				str += name;
				str += '" '
				str += 'value ="'
				var judge="True"
				
				if (r[(r.length-1)]=='结果'){
					str += r[(r.length-1)];
				}
				if (r[(r.length-1)]!='结果'){
					str += '" disabled="disabled"';
				}
									
				str += '" '
			}			
			else{
				str += 'name ="'
				str += name;
				str += '" '
			}
		}		
		str += 'style="width:100%;" ';
		
		str += '>';
		str += ' </div>';
		return str;
	};
	
	
	this.bayes1 = function(prop){
		var val = prop.value;
		var editor = prop.editor;	
		var name = prop.name;
		var id = prop.id;
		var str = '<div class="editor">'+ '<input type="text" class="form-control" id="'+id+'" editor="' + editor + '"';	
		str += 'name ="'
		str += name;
		str += '" '
		str += 'style="width:100%;" ';
		if (val != null || val != '') {
			str += 'value="'
			str += val;
			str += '" ';
		}
		str += '>';
		str += '<div class="navibayes"><input  type="button"  value="显示分类结果"></div>'
		str += ' </div>';
		return str;
	};
	
	//决策树
	this.decision_tree = function(prop){
		var val = prop.value;
		var editor = prop.editor;	
		var name = prop.name;
		var id = prop.id;
		var str = '<div class="editor">'+ '<input type="text" class="form-control" id="'+id+'" editor="' + editor + '"';
		if (name != null || name != '') {
			if (name == 'selectField'){
				str += 'name ="'
				str += name;
				str += '" '
				str += 'value ="'
				for(var n=0;n<parseInt(localStorage['length'])-1;n++){
					if (localStorage[n]!='结果')
					str+= (localStorage[n]+";")					
					}	
				str += '" '
			}
			
			if (name == 'labelField'){
				str += 'name ="'
				str += name;
				str += '" '
				str += 'value ="'
				var judge="True"
				
				if (r[(r.length-1)]=='结果'){
					str += r[(r.length-1)];
				}
				if (r[(r.length-1)]!='结果'){
					str += '" disabled="disabled"';
				}
									
				str += '" '
			}			
			else{
				str += 'name ="'
				str += name;
				str += '" '
			}
		}		
		str += 'style="width:100%;" ';
		
		str += '>';
		str += ' </div>';
		return str;
	};
	
	
	this.decision_tree1 = function(prop){
		var val = prop.value;
		var editor = prop.editor;	
		var name = prop.name;
		var id = prop.id;
		var count = ['','5','6','7','8','9','10']
		var criterion = ['','entropy','gini']
		var splitter = ['','best','random']
		var min_samples_split = ['','2','3','4','5']
		
		var str = '<div class="max_depth">';	
		str += '<font>最大树深：</font><select name="max_depth"  style="width:100%">';
		for(var i=0;i < count.length;i++){
			str += '<option value="' + count[i] +'">' + count[i] + '</option>'
		}
		str += '</select></div>'
		str += '<div class="criterion"><font>特征选择标准：</font><select name="criterion"  style="width:100%"> ';
        for(var i=0;i < criterion.length;i++){
			str += '<option value="' + criterion[i] + '">' + criterion[i] + '</option>'
		}
		str += '</select></div>';
		str += '<div class="splitter"> <font>特征划分标准（找出最优划分点的方式）：</font><select name="criterion"  style="width:100%">';
        for(var i=0;i < criterion.length;i++){
			str += '<option value="' + splitter[i] + '">' + splitter[i] + '</option>'
		}
		str += '</select></div>';
		str += '<div class="min_samples_split"> <font>划分最小样本数（剪枝处理）：</font><select name="min_samples_split"  style="width:100%">';
        for(var i=0;i < min_samples_split.length;i++){
			str += '<option value="' + min_samples_split[i] + '">' + min_samples_split[i] + '</option>'
		}
		str += '</select></div>';
		
		return str;
	};
	
	this.decision_tree2 = function(prop){
		
		var str ='<div class="decisionTree"><input  type="button"  value="显示分类结果"></div>'
		str += ' </div>';
		return str;
	};
	
	this.decision_tree3 = function(prop){
		var str = '';
		for(var n=0;n<parseInt(localStorage['length'])-2;n++){
			a = n.toString();
			str+='<div class="attribute">'+ localStorage[a] + ':<input type="text"  id="attribute" style="width:100%"></div>';
			}
		str +='<div class="dtree_predict"><input type="button"  value="显示预测结果"></div>'
		return str;
	};
	
    this.doubleSelect = function (prop) {
        //Todo 对于选择框实现 考虑把所有数据都保存到prop.value字段中 通过解析该字段展示不同的内容
        //暂时没实现字段的解析
        var val = prop.value;
        var name= prop.name;
        var editor = prop.editor;
        var id = prop.id;
        var data = editorMethod[prop.initEvent]();
        var str = '<div class="editor"> ' +
            '<select name="' + name + '"id="'+id+'ds1'+'" style="width : 100%" ';
        str+='editor="'+editor+'">';
        data.forEach(function (value,key,map) {
            str+=('<option value="'+key+'">'+data.get(key)+'</option>');
        })
        str+='</select > </div>'
        var dsstr ='<div class="editor"> ' +
            '<select name="' + name + '"id="'+id+'ds2'+'" style="width : 100%" ';
        dsstr+='editor="'+editor+'">';
        if (val != null) {
                    var kv = val.split(";");
                    if(kv.length==2) {
                        var option ='<option value="'+kv[0]+'">'+kv[1]+'</option>';
                        dsstr +=option;
            }
        }
        dsstr+='</select > </div>'
        return str+'<span></span>'+dsstr;
    };

    
	

    this.hideInput = function (prop) {
        var val = prop.value;
        var name = prop.name;
        var editor = prop.editor;
        var id = prop.id;
        var str = '<div class="editor">'
            + '<input type="text" class="form-control hide" id="'+id+'" editor="' + editor + '"';
        if (name != null || name != '') {
            str += 'name ="'
            str += name;
            str += '" '
        }
        str += 'style="width:100%;"';
        if (val != null || val != '') {
            str += ' value="'
            str += val;
            str += '" ';
        }
        str += '>'
        str += ' </div>';
        return str;
    };

    this.popupButton = function(prop) {
        var val = prop.value;
        var name = prop.name;
        var editor = prop.editor;
        var id = prop.id;
        var str = '<div class="editor">'
            + '<button type="button" class="form-control" id="'+id+'" editor="' + editor + '"';
        if (name != null || name != '') {
            str += 'name ="'
            str += name;
            str += '" '
        }
        str += 'style="width:90%;"';
        if (val != null || val != '') {
            str += ' value="'
            str += val;
            str += '" ';
        }
        str += '>'
        str += ' 点击编辑</button> </div>';
        return str;
    }
    this.hideConstInput = function (prop) {
        return this.hideInput(prop);
    }
    this.hideConstOutput = function (prop) {
        return this.hideInput(prop);
    }

}

