var current_url = "https://swift.gg";

chrome.tabs.query({
    active: true,
    currentWindow: true
}, (tabs) => {
    // console.log(tabs[0].title);
    // console.log(tabs[0].url);
    current_url = tabs[0].url
    if (current_url != "") {
        var check_issue_exist_text = document.getElementById("check_exist_text");
        check_issue_exist_text.value = current_url;
    }
});