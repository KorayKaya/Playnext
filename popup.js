function removeAll() {
    chrome.storage.local.set({
        'queue': []
    }, function() {
        writeOutQueue();
    });
}

function getTabid() {
    chrome.storage.local.get({
        'tab': []
    }, function(result) {
        tabid = result.tab;
    });
}

var tabid;

function writeOutQueue() {
    getTabid();
    queueText.innerHTML = "";
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        if (result.queue.length == 0) {
            queueText.innerHTML = "<h2 class='empty'>😓Empty😓</h2>"
            return;
        }
        result.queue.forEach(function(element, index) {
            queueText.innerHTML += "<a class='listobject' index='" + index + "'>" + element[0] + "</a>";
        });
        var queuelist = document.querySelectorAll(".listobject");
        queuelist.forEach(function(element, index) {
            element.onclick = function() {
                nextto(index);
            };
        });
    })
}

function next() {
    nextto(0);
}

function nextto(index) {
    chrome.storage.local.get({
        'queue': []
    }, function(result) {
        videoqueue = result.queue;
        var vidurl = videoqueue[index][1];
        videoqueue.splice(index, 1);
        chrome.storage.local.set({
            'queue': videoqueue
        }, function() {
            writeOutQueue();
        });
        chrome.tabs.update(tabid, {
            url: vidurl
        });
    });
}

var queueText = document.getElementById('queue');
var removeButton = document.getElementById('removeQueue');
var nextButton = document.getElementById('nextQueue');

window.onload = function() {
    writeOutQueue();
};

chrome.tabs.onUpdated.addListener(function(updatedtabid, changeinfo, updatedtab) {
    if (updatedtabid == tabid && changeinfo.url != null) {
        writeOutQueue();
    }
});

removeButton.addEventListener('click', function() {
    removeAll()
});
nextButton.addEventListener('click', function() {
    next()
});