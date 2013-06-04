/*
 * teninedialog 1.0.0
 * Copyright (c) 2013 彼岸之远  http://www.xnwai.com/
 * Date: 2013-06-03
 * 针对bootstrap模态对话框的二次封装。
 */
(function($){
	$.fn.teninedialog = function(options){
		var defaults = {
			title:'标题',
			content:'内容',
			showCloseButton:true,//显示关闭按钮
			otherButtons:[],//其他按钮文本，样式默认,["确定","取消"]
			otherButtonStyles:[],//其他按钮的样式，['btn-primary','btn-primary'],bootstrap按钮样式
			bootstrapModalOption:{},//默认的bootstrap模态对话框参数
			dialogShow:function(){},//对话框即将显示事件
			dialogShown:function(){},//对话框已经显示事件
			dialogHide:function(){},//对话框即将关闭
			dialogHidden:function(){},//对话框已经关闭事件
			clickButton:function(sender,modal,index){}//选中按钮的序号，排除关闭按钮。sender:按钮jquery对象，model:对话框jquery对象,index:按钮的顺序,otherButtons的数组下标
		}
		var options = $.extend(defaults, options);
		var modalID='';

		//生成一个惟一的ID
		function getModalID(){
			var d = new Date();
			var vYear = d.getFullYear();
			var vMon = d.getMonth()+1;
			var vDay = d.getDate();
			var h = d.getHours();
			var m = d.getMinutes();
			var se = d.getSeconds();
			var sse=d.getMilliseconds();
			return 't_'+vYear+vMon+vDay+h+m+se+sse;
		}		

		$.fn.extend({
			closeDialog:function(modal){
				var modalObj=modal;
				modalObj.modal('hide');
			}			
		});

		return this.each(function(){
			var obj=$(this);
			modalID=getModalID();
			var tmpHtml='<div id="{ID}" class="modal hide fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button><h3 id="myModalLabel">{title}</h3></div><div class="modal-body"><p>{body}</p></div><div class="modal-footer">{button}</div></div>';
			var buttonHtml='<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>';
            if (!options.showCloseButton&&options.otherButtons.length>0) {buttonHtml='';};
            //生成按钮
            var btnClass='cls-'+modalID;
            for(var i=0;i<options.otherButtons.length;i++){
            	buttonHtml+='<button buttonIndex="'+i+'" class="'+btnClass+' btn '+options.otherButtonStyles[i]+'">'+options.otherButtons[i]+'</button>';
            }
            //替换模板标记
            tmpHtml=tmpHtml.replace(/{ID}/g,modalID).replace(/{title}/g,options.title).replace(/{body}/g,options.content).replace(/{button}/g,buttonHtml);
            obj.append(tmpHtml);

            var modalObj=$('#'+modalID);                                   
            //绑定按钮事件,不包括关闭按钮
            $('.'+btnClass).click(function(){
            	var index=$(this).attr('buttonIndex');
            	options.clickButton($(this),modalObj,index);
            });
            //绑定本身的事件
			modalObj.on('show', function () {
			  options.dialogShow();
			}); 
			modalObj.on('shown', function () {			  		  
			  	options.dialogShown();
			});
			modalObj.on('hide', function () {
			  options.dialogHide();
			}); 
			modalObj.on('hidden', function () {
			  options.dialogHidden();
			  modalObj.remove();
			});
			modalObj.modal(options.bootstrapModalOption);							           
		});

	};

	$.extend({ 
	    teninedialog: function(options) {
	    	$("body").teninedialog(options);
	    } 
	});

})(jQuery);