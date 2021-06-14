var socket = io("http://52.200.172.231:808");
// var socket = io("http://localhost:8082");

socket.on("rules", function (message) {
  let rules = message.rules;
  let sessionId = message.id;

  if (document.querySelector(".Chat")) {
    const chat = new YveBot(rules, {
      target: ".Chat",
    });
    chat.validators.define("email", {
      validate: (expected, answer) => {
        const isEmail = answer.indexOf("@") > 0;
        return isEmail === expected;
      },
      warning: "Please enter a valid email",
    });

    chat.actions.define("openurl", (url) => {
      setTimeout(function () {
        window.open(url, "_blank");
      }, 1000);
    });

    chat.actions.define("redirect", (url) => {
      console.log(url);
      setTimeout(function () {
        window.location.assign(url);
      }, 1000);
    });

    // chat.actions.define("virtualtour", () => {
    //     if($(`#propdetail_table > tbody:nth-child(1)`).text().includes('Virtual Tour')){
    //         if($('#propdetail_table > tbody:nth-child(1) > tr:nth-child(8)').text().includes("Virtual Tour")){
    //             return $('#propdetail_table > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2) > a:nth-child(1)').attr('href')
    //         }
    //     }
    //     return '';
    //   });

    chat
      .on("start", function (data) {
        let bot_container = document.getElementsByClassName("Chat")[0];
        let i = document.createElement("span");
        i.innerText = "-";
        i.className = "btn btn-primary float-end rounded-circle fs-3";
        i.onclick = (e) => {
          let bot = document.getElementsByClassName("yvebot-chat")[0]
          bot.style.display = bot.style.display=="none"?"":"none";
          i.innerText=bot.style.display=="none"?"+":"-"
        };
        bot_container.insertBefore(i, bot_container.firstChild);
      })
      .on("reply", (message) => {
        socket.emit("reply", message);
      })
      .on("talk", (message, rule, sessionId) => {
        socket.emit("message", message);
      })
      .on("end", function (output) {
        socket.emit("ended");
      })
      .start();
  }
});

socket.emit("url", { message: window.location.href });
// socket.on("rules1", function (message) {
//   if (document.querySelector(".Chat")) {
//     // const chat = new YveBot(rules, {
//     //   target: ".Chat",
//     // });
//     // chat
//     //   .on("start", function () {
//     //     console.log('started')
//     // })
//     //   .on("end", function (output) {
//     //     console.log(output);
//     //     console.log('ended')

//     //   })
//     //   .start();
//   }
// });

// socket.on("userDisconnected", function () {
// });

// $("#chat").submit(function (event) {
//   event.preventDefault();

//   var message = $("input[name=message]").val();
//   socket.emit("sendMessage", {message:"abc"+message});
// });
