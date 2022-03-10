/*//////////////////////////////////////////////////////////////////////////
// ==UserScript==
// @name            Userscripts.org Scripts Source Counter
// @author          Jerone UserScript Productions
// @namespace       http://userscripts.org/users/31497
// @homepage        http://userscripts.org/scripts/show/37611
// @description     Count all characters, words and lines for scriptwriters.
// @description     Userscripts.org Scripts Source Counter v3
// @copyright       2008 - 2013 Jerone
// @version         3
// @browser         FF19
// @grant           none
// @include         *userscripts.org/scripts/new?form=true
// @include         *userscripts.org/scripts/edit_src/*
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////
THIS  SCRIPT  IS  PROVIDED BY THE AUTHOR `AS IS' AND ANY EXPRESS OR IMPLIED
WARRANTIES,  INCLUDING, BUT  NOT  LIMITED  TO, THE  IMPLIED  WARRANTIES  OF
MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO
EVENT  SHALL  THE  AUTHOR  BE  LIABLE  FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;  LOSS OF USE, DATA, OR PROFITS;
OR BUSINESS INTERRUPTION) HOWEVER  CAUSED  AND  ON  ANY THEORY OF LIABILITY,
WHETHER  IN  CONTRACT, STRICT  LIABILITY, OR  TORT  (INCLUDING NEGLIGENCE OR
OTHERWISE)  ARISING  IN  ANY  WAY  OUT  OF  THE  USE OF THIS SCRIPT, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
/*//////////////////////////////////////////////////////////////////////////

(function(){

	Number.prototype.toPoints = function(){ return (this + "").replace(/(\d)(?=(\d{3})+$)/g, '$1.'); };

	var obj, node, btn;
	if((obj = document.getElementById("script_src"))){
		obj.style["white-space"] = "pre-wrap";
		
		btn = document.createElement("input");
		btn.type = "button";
		btn.value = "Count!";
		btn.style["margin-right"] = "10px";
		btn.title = "Count all characters, words and lines and include the stats at the end of the UserScript!";
		
		node = obj.nextSibling;
		while(node.nodeType==3 || !/\S/.test(node.nodeValue)){
			node = node.nextSibling;
		}
		if(/new/i.test(location.href)){
			node.parentNode.insertBefore(btn, node.nextSibling);
		} else {
			node.insertBefore(btn, node.firstChild);
		}
		
		btn.addEventListener("click", function(){
			if(new RegExp("User" + "Stats").test(obj.value)){  // new way;
				obj.value = obj.value.replace(new RegExp("\\n*\\/\\/\\s+==User" + "Stats==[.\\w\\t\\s./():]*\\/\\/\\s+==\\/User" + "Stats=="), "");
			} else if(new RegExp("STATIS" + "TICS").test(obj.value)){  // old way;
				obj.value = obj.value.replace(new RegExp("\\n*\\/\\/\\*\\*\\* STATIS" + "TICS.*(\\n.*)*$"), "");
			}
			obj.value += stats(obj.value + stats(obj.value));  // add stats;
			obj.scrollTop = obj.scrollHeight;  // scroll to end;
		});
	}	

	function stats(data){
		return ["", "", "", "",
				"// ==User" + "Stats==",
				"// Chars (excl. spaces): " + Count.charsExclSpace(data).toPoints(),
				"// Chars (incl. spaces): " + Count.charsInclSpace(data).toPoints(),
				"// Words: " + Count.words(data).toPoints(),
				"// Lines: " + Count.lines(data).toPoints(),
				"// ==/User" + "Stats=="].join("\n");
	}

	var Count = {
		charsExclSpace: function(str){
			return str.replace(/\s/gi, "").length;
		},
		charsInclSpace: function(str){
			return str.length - Count.lines(str) + 1;
		},
		/*charsChinese: function(str){
			var c = 0, i = 0;
			for(; i < str.length; i++){
				if(str.charCodeAt(i) > 255){
					c++;
				}
			}
			return c;
		},*/
		words: function(str){
			return str.split(/\s/g).filter(function(item){ return !!item; }).length;
		},
		lines: function(str){
			return str.split(/\n/gi).length;
		}
	};

})();



// ==UserStats==
// Chars (excl. spaces): 3.193
// Chars (incl. spaces): 3.795
// Words: 411
// Lines: 107
// ==/UserStats==