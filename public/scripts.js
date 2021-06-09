var socket = io("http://localhost");

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

    chat.actions.define("redirect", (url) => {
      setTimeout(function () {
        window.location.assign(url);
      }, 1000);
    });

    chat
      .on("start", function (data) {
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
