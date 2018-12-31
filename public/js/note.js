  // Initialize Firebase
  var log = console.log;
  var config = {
    apiKey: "AIzaSyBBcOP_RD50NoCKt0BDlM4Xu-K2CQ7x8zs",
    authDomain: "keemdb-note.firebaseapp.com",
    databaseURL: "https://keemdb-note.firebaseio.com",
    projectId: "keemdb-note",
    storageBucket: "keemdb-note.appspot.com",
    messagingSenderId: "440886800502"
  };
  firebase.initializeApp(config);

  var db = firebase.database(); //데이터베이스 가져옴
  var ref = null;
  var auth = firebase.auth(); //auth 가져옴
  var google = new firebase.auth.GoogleAuthProvider(); //구글인증사용하는것
  var user = null;
  var li = $(".navs");
  var ta = $("#content");

  //signIn 되면 실행되는 함수
function init(){
  li.empty(); //#navs 내용 지움
  ref = db.ref("root/note/"+user.uid);
  ref.on("child_added", callbackAdd);
  ref.on("child_changed", callbackChg);
  ref.on("child_removed", callbackRev);
}
//데이터베이스 콜백함수들
function callbackAdd (data){
    log("추가", data.key, data.val());
    var html = `
    <ul id="${data.key}">
      <li>${data.val().content.substr(0, 16)}..</li>
      <li>${timeConverter(data.val().saveTime)}</li>
      <li onclick="delData(this);">x</li>
    </ul>
    `;
    li.append(html);
}
function callbackChg (data){
  log("수정", data.key, data.val());
}
function callbackRev (data){
  //log("삭제", data.key, data.val());
  $("#"+data.key).remove();
}


//데이터베이스 구현
$("#bt_add").click(function(){
  ref = db.ref("note"); //note라는 데이터베이스를 가져와
  ref.remove();
});
$("#bt_save").click(function(){
  var content = ta.val();
  if(content == '') {
    //컨텐츠가 빈값일 경우
    alert("내용을 입력하세요.");
    ta.focus(); //focus는 커서를 갖다놓는 명령어
  }else{
    //빈값이 아닐 경우
    ref = db.ref("root/note/"+user.uid);
    ref.push({
      content: content,
      saveTime: new Date().getTime()
    }).key;
  }
});
$("#bt_cancel").click(function(){
  ta.val('');
});
function delData(obj){
  if(confirm("정말로 삭제?")){
  var id = $(obj).parent().attr("id");
  ref = db.ref("root/note/"+user.uid+"/"+id);
  ref.remove();
  }
}



  //인증구현
//2번방식
$("#bt_google_login").click(function(){
  auth.signInWithPopup(google); //로그인을 팝업처리
  //auth.signInWithRedirect(google); //로그인을 페이지내에서 처리
});
$("#bt_google_logout").click(function(){
  auth.signOut();
});
auth.onAuthStateChanged(function(data){
  if(data){
    //로그인상태
    user = data;
    $("#bt_google_login").hide();
    $("#bt_google_logout").show();
    $(".email").html(user.email);
    $(".symbol").show();
    $(".symbol > img").attr("src", user.photoURL);
    init();
  }else{
    //로그아웃상태
    user = null;
    $("#bt_google_logout").hide();
    $("#bt_google_login").show();
    $(".email").html();
    $(".symbol").show();
    $(".symbol > img").attr("src", "");
  }
});

/***** Timestamp 값을 GMT표기로 바꾸는 함수 *****/
function timeConverter(ts){
  var a = new Date(ts);
  log(a);
//	var months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
	var year = a.getFullYear();
	//var month = months[a.getMonth()];
	var month = addZero(a.getMonth()+1);
	var date = a.getDate();
	var hour = a.getHours();
	var min = a.getMinutes();
	var sec = a.getSeconds();
	//var str = String(year).substr(2)+"년 "+month+" "+date+"일 "+amPm(addZero(hour))+"시 "+addZero(min)+"분 "+addZero(sec) +"초";
	/* var str = year+"년 "+month+" "+date+"일 "+amPm(hour)+"시 "+addZero(min)+"분 "+addZero(sec) +"초"; */
	var str = year+"-"+month+"-"+date+" "+hour+":"+addZero(min)+":"+addZero(sec);
	return str;
}

/***** 0~9까지의 숫자의 앞에 0을 붙이는 함수 *****/
function addZero(n) {
	if(n<10) return "0"+n;
	else return n;
}

/***** 오전/오후 붙여주는 함수 *****/
function amPm(h) {
	if(h<12) return "오전 "+addZero(h);
	else if(h>12) return "오후 "+addZero(h-12);
	else return "오후 12";
}

  //uid는 실제 내 ID
  //photoURL 심볼 프사




    //1번방식
/*   //클릭하면 auth로 로그인, 싸인팝업띄우고 data값을 받을께요
  $("#bt_google_login").on("click", function(){
    auth.signInWithPopup(google).then(function(data){
      $("#bt_google_login").hide();
      $("#bt_google_logout").show();
      user = data.user;
      $(".email").html(user.email);
      $(".symbol").show();
      $(".symbol > img").attr("src", user.photoURL);
    });
  });
$("#bt_google_logout").on("click", function(){
  auth.signOut().then(function(data){
    $("#bt_google_logout").hide();
    $("#bt_google_login").show();
    user = null;
    $(".email").html();
    $(".symbol").show();
    $(".symbol > img").attr("src",);

  });
}); */
