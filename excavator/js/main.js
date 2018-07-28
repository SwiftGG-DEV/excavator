/*
 ** file: js/main.js
 ** description: javascript code for "html/main.html" page
 */

const url_re = /https?:\/\/[a-z0-9_.:]+\/[-a-z0-9_:@&?=+,.!/~*%$]*(\.(html|htm|shtml))?/;


function init_main() {
    $('html').hide().fadeIn('slow');
}

function progress_format(percent) {
    check_exist_progress.style.width = percent + "%";
}

function tip_format(is_exist, tot, link = "") {
    if (is_exist) {
        check_exist_tips.innerHTML = "查询" + tot + "条，查询到该文章. <a href='" + link + "'>点击打开</a>";
    } else {
        check_exist_tips.innerHTML= "查询" + tot + "条，未发现这篇文章. <a href='https://github.com/SwiftGGTeam/translation/issues/new'>点击创建</a>";
    }
}

//bind events to dom elements
document.addEventListener('DOMContentLoaded', init_main);

var current_url = "https://swift.gg";
var items_count = 0;

/// GitHub API
function check_issue_exist(page = 1) {
    var data = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.github.com/repos/SwiftGGTeam/translation/issues?state=all&page=" + page, true);
    
    xhr.onload = function() {
        var json_response = JSON.parse(xhr.responseText);
        if (json_response.length == 0) {
            // 没有找到这篇文章
            check_issue_exist_btn.disabled = false;
            check_issue_exist_btn.innerText = "没有这篇文章";
            progress_format(100);
            tip_format(false, items_count);
            return;
        }
        for (var index = 0; index < json_response.length; index ++) {
            items_count ++;
            var issue_body = json_response[index]["body"];
            var res = issue_body.match(url_re);

            progress_format(items_count);

            if (res != null) {
                if (current_url == res[0]) {
                    check_issue_exist_btn.disabled = false;
                    check_issue_exist_btn.innerText = "已经有这篇文章";
                    progress_format(100);
                    tip_format(true, items_count, json_response[index]["html_url"]);
                    return;
                }
            }
        }
        
        // 继续递归
        check_issue_exist(page + 1);
    }
    xhr.send(data);
    
}

// 查重进度条
var check_exist_progress = document.getElementById("check_exist_progress");

// 查重提示
var check_exist_tips = document.getElementById("check_exist_tips");

// 查重按钮
var check_issue_exist_btn = document.getElementById("check_exist_button");
check_issue_exist_btn.onclick = function () {
    // button 修改状态 
    check_issue_exist_btn.disabled = true;
    check_issue_exist_btn.innerText = "检测中...";
    progress_format(0);

    // 获取地址 
    var check_issue_exist_text = document.getElementById("check_exist_text");
    current_url = check_issue_exist_text.value;
    items_count = 0;
    check_issue_exist();
}
