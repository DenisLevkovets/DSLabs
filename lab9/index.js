let http = new XMLHttpRequest();
let url = 'http://54.65.218.53:8080/';


function send_msg() {

    let msg = document.querySelector('.text-input').value;
    let isActive = document.querySelectorAll('.nav-link')[0].className.split(' ')[1] === 'active';
    let who = 0;
    if (!isActive) who = 1;

    let params = `msg=${msg}&who=${who}`;
    http.open('POST', url + 'add', true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {


            if (who) {
                let elem1 = document.createElement('p');
                elem1.className = 'chat-msg guest-msg--own';
                elem1.style.padding = '0 5px 0 5px';
                elem1.innerHTML = msg;
                let chat2 = document.querySelector('.chat2');
                chat2.appendChild(elem1);
            } else {

                let elem2 = document.createElement('p');
                elem2.className = 'chat-msg guest-msg--own';
                elem2.style.padding = '0 5px 0 5px';
                elem2.innerHTML = msg;
                let chat1 = document.querySelector('.chat1');
                chat1.appendChild(elem2);
            }
        }
    };
    http.send(params);
}


function get_msgs() {
    let isActive = document.querySelectorAll('.nav-link')[0].className.split(' ')[1] === 'active';
    let who = 0;
    if (!isActive) who = 1;
    http.open('GET', url + 'msgs', true);

    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.onreadystatechange = function () {//Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            let res = JSON.parse(http.response)
            res.map((msg) => {
                let elem1 = document.createElement('p');
                elem1.className = 'chat-msg guest-msg--own';
                elem1.style.padding = '0 5px 0 5px';
                elem1.innerHTML = msg.msg;

                let elem2 = document.createElement('p');
                elem2.className = 'chat-msg guest-msg--another';
                elem2.style.padding = '0 5px 0 5px';
                elem2.innerHTML = msg.msg;

                let chat1 = document.querySelector('.chat1');
                let chat2 = document.querySelector('.chat2');

                if (who) {
                    if(msg.who) chat2.appendChild(elem1);
                    else {
                        chat2.appendChild(elem2)
                    }
                } else {
                    if(msg.who) chat1.appendChild(elem2)
                    else chat1.appendChild(elem1);
                }
            })
        }
    };
    http.send()
}


get_msgs()
