/**
 */
var Util = {
	//一下为ajax更新数据库方法
	updateNode: function(node, type) {
		//type参数暂时没用 该参数设计主要用来判断节点是否需要更新自己和所有连接与参数信息 如果添加该参数需要在Controller中修该方法参数
		$.ajax({
			type: "POST",
			// url: "/project/savetask",
			url:"/static/savetask",   //http请求
			data: node,
			success: function(msg) {
				if(msg.code != 1) {
					alert('erro accur:' + msg.msg);
				}
			}
		});
	},
	updateTaskParam: function(param) {
		$.ajax({
			type: "POST",
			//url: "/project/saveParam",
			url:"/static/saveParam",
			data: param,
			success: function(msg) {
				if(msg.code != 1) {
					alert('erro accur:' + msg.msg);
				}
			}
		});
	},
	delTask: function(id, json) {
		$.ajax({
			type: "POST",
			//url: "/project/delTask",
			url:"/static/delTask",
			data: {
				taskId: id,
				taskJson: json
			},
			success: function(msg) {
				if(msg.code != 1) {
					alert('erro accur:' + msg.msg);
				}
			}
		});
	},
	delConnection: function(sid,tid) {
		var data= {'sourceid': sid,'targetid': tid,'type': 'delConnection'};
		$.ajax({
			type: "POST",
			url:"/task",
			data: JSON.stringify(data),
			contentType: 'application/json; charset=UTF-8',
			success: function(msg) {
				if(msg.code != '1') {
					alert('erro accur:' + msg.msg);
				}
			}
		});
	},
	saveConnection: function(id, sid, tid,stype,ttype) {
		 var data= {
                    'relId': id,
					'task.taskId': sid,
					'toTaskId': tid,
					'sourceType':stype,
					'targetType':ttype,
					'type':'saveConnection',
                
            };
		

		$.ajax({
			type: "POST",
			
			url:"/task",
			data: JSON.stringify(data),
			success: function(msg) {
			}
		});
	},

	doPost: function(path, data) {
		var result = null;
		$.ajax({
			type: "POST",
			url: path,
			data: data,
			async: false,
			success: function(msg) {
				result = msg;
			}
		});
		return result;
	},

	doGet: function(path, data) {
		var result = null;
		$.ajax({
			type: "GET",
			url: path,
			data: data,
			success: function(msg) {
				result = msg;
			}
		});
		return result;
	},

	///////////////////////////////////////////////////////////////////

	//project中的c_window设置成jsPlumb对象 也是全局唯一的helper
	helper: new jsPlumbHelper('c_window'),

	getHelper: function() {
		if(this.helper.isInit == false) {
			this.helper.init();
		}
		return this.helper;
	},

	getJSPlumb: function() {
		return this.helper.getJsPlumbInstance();
	},

	//阻止事件冒泡
	stopBubble: function(e) {
		//如果提供了事件对象，则这是一个非IE浏览器
		if(e && e.stopPropagation)
		//因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		else
		//否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
	},

	//右边属性框icon改变时间 upDownEvent同样
	rightDownEvent: function(id) {
		var panel = $('#' + id).parent('.panel');
		var span = panel.children('span')[0];
		var $span = $(span);
		if($span.hasClass('glyphicon-chevron-down')) {
			$span.removeClass('glyphicon-chevron-down');
			$span.addClass('glyphicon-chevron-right');
			return;
		}

		if($span.hasClass('glyphicon-chevron-right')) {
			$span.removeClass('glyphicon-chevron-right');
			$span.addClass('glyphicon-chevron-down');
			return
		}
	},

	//the event of click contorller right span
	upDownEvent: function(e) {
		var span = $(this);
		span.toggleClass("glyphicon-chevron-up").toggleClass("glyphicon-chevron-down");
		if(span.hasClass("glyphicon-chevron-up")) {
			span.siblings("p").show();
		}
		if(span.hasClass("glyphicon-chevron-down")) {
			span.siblings("p").hide();
		}
		if(e && e.stopPropagation)
		//因此它支持W3C的stopPropagation()方法
			e.stopPropagation();
		else
		//否则，我们需要使用IE的方式来取消事件冒泡
			window.event.cancelBubble = true;
	},

	/**
	 * @description 鼠标点击task节点事件
	 *    主要包括：
	 * 1.更新上一个节点信息到数据库
	 * 2.把点击选择到的节点的所有prop信息展示到属性框
	 * 3.给添加的每一个属性样式添加点击事件
	 * @param e
	 */
	clickEventOnNode: function(e) {
		var util = this;
		var helper = this.helper;
		var key = '';
		//先保存上一个节点
		var lastnode = helper.getCurrentNode();
		if(lastnode != null) {
			//todo update node here
			
		}
		if(e != null)
			key = e.currentTarget.id;
		else {
			//对于ie浏览器
		}
		var content = $('#prop_container');
		content.empty();
		helper.setCurrentNode(key);

		var node = helper.container.getNode(key);
		var props = node.prop;
		for(var i = 0; i < props.length; i++) {
			var inputType = props[i].editor;
			var str = this.buildPannel(node, i);
			switch(inputType) {
				case 'select':
					var selectPannel = $(str).appendTo(content);
					var select = selectPannel.find('select');
					select.change(editorMethod[props[i].changeEvent]);
					break;
				case 'popupButton':
					var popupButtonPannel = $(str).appendTo(content);
					var popupButton = popupButtonPannel.find('button');
					popupButton.click(editorMethod[props[i].callback])
					break;
				case 'doubleSelect':
					var selectPannel = $(str).appendTo(content);
					var select = selectPannel.find('select')[0];
					$(select).change(editorMethod[props[i].changeEvent]);
					break;
				case 'checkbox':
					var checkboxPannel = $(str).appendTo(content);
					var check = checkboxPannel.find('input');
					check.click(editorMethod[props[i].changeEvent]);
					break;
				case 'normalization':
					var normalizationPannel = $(str).appendTo(content);
					var normal = normalizationPannel.find('input');
					normal.click(editorMethod[props[i].changeEvent]);
					break;
				case 'bayes1':	
					var bayesPannel = $(str).appendTo(content);
					var navibayes = bayesPannel.find('input');
					navibayes.click(editorMethod[props[i].changeEvent]);
					break;
				
				case 'decision_tree1':	
					var d_treePannel1 = $(str).appendTo(content);
					var decision_tree1 = d_treePannel1.find('select');
					decision_tree1.click(editorMethod[props[i].changeEvent]);
					break;
				case 'decision_tree2':	
					var d_treePannel2 = $(str).appendTo(content);
					var decision_tree2 = d_treePannel2.find('input');
					decision_tree2.click(editorMethod[props[i].changeEvent]);
					break;
				case 'decision_tree3':	
					var d_treePannel3 = $(str).appendTo(content);
					var decision_tree3 = d_treePannel3.find('input');
					decision_tree3.click(editorMethod[props[i].changeEvent]);
					break;
				default:
					content.append(str);
			}

		}

		$('.panel-collapse').on('show.bs.collapse', function() {
			var id = this.id;
			util.rightDownEvent(id);
		});
		$('.panel-collapse').on('hidden.bs.collapse', function() {
			var id = this.id;
			util.rightDownEvent(id);
		})
		this.stopBubble(e);
	},

	//构建task元素字符串
	buildRect: function(node) {
		var s = '<div id="' + node.id +
			'" class="tasknode">' +
			'<span class="' + node.rect.srcClass +
			'"></span> <strong>' + node.rect.text +
			'</strong>' +
			'<span class="glyphicon glyphicon-chevron-down"></span>' +
			'<p>' + node.rect.note + '</p></div>';
		return s;
	},

	//构建右边属性框元素字符串
	buildPannel: function(node, index) {
		var props = node.prop;
		var id = node.id + index;
		var val = props[index].value;
		var editor = props[index].editor;
		var name = props[index].name;
		var str = null;

		//判断字符是否带有hide字
		if(editor.match('hide'))
			str = this.helper.editor.pannel(true);
		else
			str = this.helper.editor.pannel(false);
		str += this.helper.editor.smallIcon();
		str += this.helper.editor.pannelLabel(props[index].label, id);
		var content = null;
		
		if(editor == 'select') {
			content = this.helper.editor[editor](props[index]);
		} else {
			content = this.helper.editor[editor](props[index]);
		}
		str += this.helper.editor.pannelBody(id, content);
		str += '</div>';
		return str;
	},

	//绑定右键菜单事件 该方法使用了Jquery的右键菜单依赖 需要导入相关jq库
	bindcontextmenu: function(idValue) {
		var util = this;
		var helper = this.getHelper();
		var id = "#" + idValue;
		var el = $(id);
		$(id).contextPopup({
			//		title: 'My Popup Menu',
			items: [{
				label: '删除本节点',
				action: function() {
					if(confirm("确定删除本节点吗?")) {

						var target = helper.container.getNode(idValue);
						//删除连线操作
						helper.container.nodes.forEach(function(node, index, array) {

							var connections = node.connections;
							for(var i = 0; i < connections.length; i++) {
								if(connections[i].targetId == idValue ||
									connections[i].sourceId == idValue) {
									helper.container.removeConnection(
										connections[i].sourceId,
										connections[i].suuid,
										connections[i].tuuid
									)
								}
							}
						});
						helper.instance.detachAllConnections(el);
						var del = helper.container.getNode(idValue);
						util.delTask(idValue, JSON.stringify(del));
						helper.instance.removeAllEndpoints(idValue);
						$(id).remove();


						var data= {'endid': idValue,'type':'delNode'};
						// alert(idValue)
						$.ajax({
							type: "POST",
							url: "/task",
							data:JSON.stringify(data),
							// contentType: 'application/json; charset=UTF-8',
							success: function() {
								alert("删除结点成功！")
								}
							});
					}

				}
			}, {
				label: '查看日志',
				action: function() {
					alert('查看日志');
				}
			}, {
				label: '运行到此处',
				action: function() {
                    if (confirm("确定运行至本节点吗?")) {
                        var endnode = helper.container.getNode(idValue)
                        var data= {'endid': idValue,'endtype':endnode.type,'type':'saveLine'};

                        $.ajax({
                            type: "POST",
                            url: "/task",
                            data: JSON.stringify(data),
                             // contentType: 'application/json; charset=UTF-8',
                            success: function () {

                                alert("运行成功");

                            }
                        });

                    }
                }
			}, {
				label: '查看结果',
				action: function() {
					alert('查看结果');
				}
			}, ]
		});
	},
	/**
	 * @author Wang zhiwen
	 * @description 构建弹出框显示元数据表格
	 * @param list
	 * @returns {string}
	 */
	buildMetaTable: function(list) {
		var str = '<table class="table table-striped">' +
			'<caption>选择元数据字段</caption>' +
			'<thead>' +
			'<tr>' +
			'<th>字段名</th>' +
			'<th>别名</th>' +
			'<th>描述</th>' +
			'</tr>' +
			'</thead>' +
			'<tbody>'
		for(var i = 0; i < list.length; i++) {
			var column = '<tr><td>' + list[i].fieldName + '</td>' +
				'<td>' + list[i].fieldCnName + '</td>' +
				'<td>' + list[i].fieldDesc + '</td>' +
				'<td>'
				// +'<div class="btn-group" data-toggle="buttons">'
				+
				'<label class="btn btn-primary">' +
				'<input type="radio" name="' + 'isSelect' + i + '" value="yes" checked="checked"> 已选 </label>' +
				'<label class="btn btn-primary">' +
				'<input type="radio" name="' + 'isSelect' + i + '" value="no"> 未选 </label>'
				// +'</div>'
				+
				'</td>' +
				'</tr>'
			str += column
		}
		str += '</tbody>'
		str += '</table>'
		return str;
	}
};

var data_selected='';
var normal='';
var save_selected = '';
var dtree_data='';
var editorMethod = {
	defaultInit: function(prop) {
		if(prop != null)
			alert(prop)
		var map = new Map();
		map.set('key1', 'value1');
		map.set('key2', 'value2');
		return map;
	},
	defaultChange: function(event) {
		//Todo change事件看需求写 暂时没想法

		var select = $(this).val()
		alert(select)
	},
	
	tablemateEventChange: function() {
		
		localStorage.clear();//清除localStorage保存对象的全部数据
		var selected = $(this).val();
		var prop_id = this.id.substring(0, 16);
		
		var collapse = $('#' + this.id).closest('.panel-collapse')[0];
		var node_id = collapse.id.substring(0, 16);
		var node = Util.helper.container.getNode(node_id);
		var prop = Util.helper.container.getPropByID(prop_id, node);
		 
		//var secendSelect = $('#' + prop_id + 'ds2')[0];
		//todo ajax for here
		var data = {"data":selected,"type":'data_source'};
		
		save_selected = data;
		
		$.ajax({
			type: "POST",
			url: "/task",
			data:JSON.stringify(data),
			contentType: 'application/json; charset=UTF-8',
			//  新增content-type头部属性
			success: function(data) {
				window.r = data.attribute;
				data_selected = '';
				//console.log(localStorage);
				for(var i=0;i<r.length;i++){
					var attribute = r[i];
					
					data_selected+='<div class="check"><input type="checkbox"  id="'+attribute+'" value="'+attribute+'"><label for="'+attribute+'">'+attribute+'</label></div>';
					}
			}
		});
	},	
	
	
	checked_attribute: function() {
		//localStorage.clear();//清除localStorage保存对象的全部数据
		var arr = new Array();
	
		var obj = $("input[type='checkbox']");
		
		for(k in obj){
			if(obj[k].checked)
				arr.push(obj[k].value);
		}
				
		var data = {"data":arr,"type":'field'};
		
		var checked=$('input[type=checkbox]:checked');
		checked.each(function (i) {
			localStorage.setItem(i,$(this).val());
			localStorage.setItem('length',i);
			
		});
		
		
		$.ajax({
			type: "POST",
			url: "/task",
			data:JSON.stringify(data),
			contentType: 'application/json; charset=UTF-8',
			//  新增content-type头部属性
			success: function(data) {
				normal = data.normalization;
				
					
				}
			    
			
		});
	},	
	
	show_normalization:function(){
		var html='<table border="1">';
		$.each(normal,function(i,item){
			html+='<td><table><tr><th>'+i+'</th></tr>';
			var item=0;
			for(var n=0;n<normal[i].length;n++){
				var item = normal[i][n];
				
				html += "<tr><td>" + parseFloat(item) + "</td></tr>";
				}
			html+='</table></td>';
			
			});
		html+='</table>';
		
		$(".editor").html(html);
	},
	
	show_pca:function(){
		
		$.ajax({
			type: "POST",
			url: "/task",
			data:JSON.stringify(data),
			contentType: 'application/json; charset=UTF-8',
			//  新增content-type头部属性
			success: function(data) {
				normal = data.pca;
				
					
				}
			    
			
		});
	},
	
	show_bayes:function(){
		var arr = [];
		for(var i=0;i<r.length;i++){
			var attribute = r[i];
			arr.push(attribute);
			}			
		var data = {'data':normal,'filename':save_selected['data'],'type':'bayes'}
		
		$.ajax({
			type: "POST",
			url: "/task",
			data:JSON.stringify(data),
			contentType: 'application/json; charset=UTF-8',
			//  新增content-type头部属性
			success: function(data) {
				
				var rows = data.rows;
				var train = data.train;
				var test = data.test;
				var accuracy = data.accuracy;
				var attribute = data.attribute;
				var result = data.result;
				localStorage.setItem('accuracy',accuracy);
				var html='<p>Split ' + rows + ' rows into train=' + train + ' and test=' + test + ' rows</p>';
				html+='<div id="gallery"><a href="static/picture/bayes.jpg" "><img src="static/picture/bayes.jpg" width="50" height="50" alt="" /></a></div>'
				//html+='<img class="dialog" src="static/picture/bayes.png" width="50" height="50"><div id="dialog_large_image"></div>'
				//html+='<div height="400" width="600" style="margin:50px"><canvas id="chart"> 你的浏览器不支持HTML5 canvas </canvas></div>'
				html+='<table border="1px" width="400">';
				html+='<tr>'
				for(var i=0;i<attribute.length;i++){
					html+='<th>'+attribute[i]+'</th>'
				}
				html+='<th>预测</th>'
				html+='</tr>'
				for(var i=0;i<result.length;i++){
					html+='<tr>'
					for(var n=0;n<result[i].length;n++){
						html+='<td>'+result[i][n]+'</td>';						
					}
					html+='</tr>'
				}
				html+='</table>';
				$(".navibayes").html(html);
				$(function() {
					$('#gallery a').lightBox();
				});
			
			}	
		});
		
		//localStorage.clear();
	},
	
	dtree_attribute:function(){
		var max_depth = $(".max_depth option:selected").val();
		var criterion = $(".criterion option:selected").val();
		var splitter = $(".splitter option:selected").val();
		var min_samples_split = $(".min_samples_split option:selected").val();
		dtree_data = {'data':normal,'type':'decision_tree','max_depth':max_depth,'criterion':criterion,'splitter':splitter,'min_samples_split':min_samples_split}
	},	
	
	
	dtree_result:function(){
		
		$.ajax({
			type: "POST",
			url: "/task",
			data:JSON.stringify(dtree_data),
			contentType: 'application/json; charset=UTF-8',
			//  新增content-type头部属性
			success: function(data) {
				var score = data.score;
				var html = '<div class="score"><p>测试模型的有效性为：' + score +'</p></div>' 
				html += '<div id="gallery"><a href="static/picture/dtree.png" "><img src="static/picture/dtree.png" width="50" height="50" alt="" /></a></div>'
				
				
				$(".decisionTree").html(html);
				$(function() {
					$('#gallery a').lightBox();
				});
			
			}	
		});
		
	},
	
	dtree_predict:function(){
		var predict_data = [];
		$(".attribute input[type='text']").each(function(){
			predict_data.push($(this).val())
		});
		var dtree = {'data':predict_data,'type':'dtree_predict'}
		
		$.ajax({
			type: "POST",
			url: "/task",
			data:JSON.stringify(dtree),
			contentType: 'application/json; charset=UTF-8',
			//  新增content-type头部属性
			success: function(data) {
				pred = data.pred;
				var html='<div class="result">预测结果:<input type="text"  style="width:100%" value="' + pred['0'] +'"></div>';
				$(".dtree_predict").html(html);
				
			
			}	
		});
	},
	
	buttonPopup: function(event, prop) {
		//Todo 弹出框实现方法 目前弹出框没内容

		//获取node对象
		var index = null;
		var button = event.delegateTarget;
		var prop_id = button.id;
		var prop_value = button.value;
		var collapse = $('#' + prop_id).closest('.panel-collapse')[0];
		var node_id = collapse.id.substring(0, 16);
		var node = Util.helper.container.getNode(node_id);

		var tableParams = $('#table-params');
		//移除hide class用于layer显示
		tableParams.removeClass("hide");
		var metaDataList = null;
		//todo ajax for here

		var lt = layer.open({
			type: 1,
			title: '****',
			fix: true,
			scrollbar: true,
			area: ['85%', '90%'], //宽高
			content: $('#table-params'), //project.jsp中的一个隐藏div
			btn: ['保存', '取消'],
			yes: function(index, layero) {
				var trs = $($(tableParams[0]).find('table')[0]).find('tr');
				var prop = Util.helper.container.getPropByID(prop_id, node);
				var value_str = '';
				for(var i = 0; i < trs.length; i++) {
					var tds = $(trs[i]).find('td');
					if(tds.length != 0) {
						//减1的原因是因为表头不处理 故减1
						var radio = $(tds[3]).find('input:radio[name="isSelect' + (i - 1) + '"]:checked')[0].value;
						if(radio == 'yes') {
							for(var j = 0; j < tds.length - 1; j++) {
								//Todo 针对表元信息 由于表源信息缺少类型字段 下面为样式代码
								var td_value = tds[j].innerHTML;
								if(td_value != null || td_value != '') {
									value_str += td_value;
									value_str += ",";
								}
								value_str += ';'
							}
						}

					}

				}
				prop.value = value_str;
			},
			btn2: function(index, layero) {}
		});
	}
	
	
	
      
        

}