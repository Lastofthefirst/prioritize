// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app', // App root element
  id: 'io.framework7.testapp', // App bundle ID
  name: 'Framework7', // App name
  theme: 'auto', // Automatic theme detection
  // App root data
  data: function () {
    return {
      user: {
        firstName: 'John',
        lastName: 'Doe',
      },
    };
  },
  // App root methods
  methods: {
    helloWorld: function () {
      app.dialog.alert('Hello World!');
    },
  },
  // App routes
  routes: routes,
});

// Init/Create main view
var mainView = app.views.create('.view-main', {
  url: '/'
});

let title = "",
    body = "",
    timeStamp = "",
    uid = "",
    element = document.getElementById("cardContainer");
    list = document.getElementById("notes_list");
    notesCollection = JSON.parse(localStorage.getItem("notesArray"));
    if (notesCollection==null) {
      notesCollection = [];
    };
    loadNotes();
    titleList();
    highLight();





function expand(thisId, thisHeight, thisNewHeight) {
  let change = document.getElementById(thisId).style;

  change.height = change.height === thisNewHeight ? thisHeight : thisNewHeight;
}

function htmlSwap() {
  expand('addItemBar', '50px', '370px');
  document.getElementById('buttonWrapper').innerHTML = `<div id="buttonWrapper" onclick="newButtons();">
  <button  class="col button">Add Item</button>`;
}



function newButtons(){
  expand('addItemBar', '50px', '370px');
  document.getElementById('buttonWrapper').innerHTML = `<button id ="submit" onclick="htmlSwap();" class="col button">Cancel</button>`
}
// Below the array of note objects is iterated through adding html elements containing the properties of each note objects.
function loadNotes(){
  element.innerHTML = "";
  for (i = 0; i < notesCollection.length; i++){
      var htmlString = `<div class="card ${notesCollection[i].highlight}" data-uid='${notesCollection[i].uid}'>
      <div class='firstRow'>
      <div>${Number(i+1)}</div>
      <button data-uid=${notesCollection[i].uid} onclick='moveUp(this);'>^</button>
      <button data-uid='${notesCollection[i].uid}' onclick='moveDown(this);'>v</button>
      </div>
      
      <div class='secondRow'>
      <h1>${notesCollection[i].title}</h1>
      <p>${notesCollection[i].body}</p>
      <button data-uid='${notesCollection[i].uid}' onclick='purchased(this);'>Purchased</button>
      </div>
      
      <div class='thirdRow'>
      <h1>${notesCollection[i].cost}</h1>
      <button href='#' onclick='editMe(this);' style='float:right; margin-right:10px;'>Edit</button>
      <button href='#' onclick='deleteMe(this);' style='float:right; margin-right:10px;' data-uid='${notesCollection[i].uid}'>X</button>
      </div>
      
      </div>`;
      var noteDiv = document.createElement('article');
      noteDiv.innerHTML = htmlString;
      element.appendChild(noteDiv);
      if (notesCollection==null) {
        notesCollection = [];
    }
  }
};












function editMe(thisthis){
    // define the html string, its delicate, needs to be adjusted if more html nodes are added
    let editString = `<div><h1><input type='text' placeholder='Oops! You forgot a title!' value='${thisthis.parentNode.children[2].innerText}'><input type='text' placeholder='Oops! You forgot a title!' value='${thisthis.parentNode.children[3].innerText}'></h1><input type='text' placeholder='No Content!' value='${thisthis.parentNode.children[5].innerText}'><button style='float:right; margin-right:10px;' onclick='loadNotes()'>Cancel</button><button href='' onclick='saveChanges(this)' style='float:right; margin-right:10px;' data-uid='${thisthis.parentNode.getAttribute('data-uid')}'>Save</button></div><hr>`;
  // find the parent replace the parent with an html string.
    thisthis.parentNode.parentNode.innerHTML = editString;
}

// Finds a particular Object's index by a given property
// Super useful, i think ES6 has a way to make it a little cleaner with a newer version of a for loop
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] == value) {
            return i;
        }
    }
    return -1;
}

function highLight(){
  
  let moneyLeft = document.getElementById('spending').value;
  for (let i =0; i<notesCollection.length; i++){
    if (Number(notesCollection[i].cost) <= moneyLeft){
      notesCollection[i].highlight= true;
      moneyLeft = moneyLeft - notesCollection[i].cost;
    }
    else{
      notesCollection[i].highlight = false;
      moneyLeft = moneyLeft - notesCollection[i].cost;
    }
  }
  loadNotes();
  titleList();
}



// Saves the changes made from the editMe function to the original object and reloads notes.
function saveChanges(thisHere){
  // This is a bit delicate, will need to be adjusted if new html nodes are added above.
  let newBody = thisHere.parentNode.children[1].value,
      newTitle = thisHere.parentNode.children[0].children[0].value,
      newCost = thisHere.parentNode.children[0].children[1].value,
      thisUid = thisHere.getAttribute("data-uid"),
      thisIndex = findWithAttr(notesCollection, 'uid', thisUid);


  notesCollection[thisIndex].title = newTitle;
  notesCollection[thisIndex].body = newBody;
  notesCollection[thisIndex].cost = newCost;

  let notesCollectionSerialized = JSON.stringify(notesCollection);
  localStorage.setItem("notesArray", notesCollectionSerialized);
    // 5. Reload notes & title list
  loadNotes();
  titleList();
  // Set the .title and .body properties of the particular note object to the new input's values.

};
// Deletes a specific note from the array, localStorage and the display.
function deleteMe(thisthis){
    // 1. find parent of the button, delete parent from DOM
  thisthis.parentNode.parentNode.parentNode.removeChild(thisthis.parentNode.parentNode);
    // 2. find object in array
  var thisUid = thisthis.getAttribute("data-uid");
    // 3. delete object from array
  notesCollection = notesCollection.filter(function( obj ) {
    return obj.uid !== thisUid;
  });
    // 4. save array to localstorage
  let notesCollectionSerialized = JSON.stringify(notesCollection);
  localStorage.setItem("notesArray", notesCollectionSerialized);
    // 5. Reload notes & title list
  loadNotes();
  titleList();
  highLight();
};

//Adds an h2 with the title of the new note upon creation.
function titleList(){
  list.innerHTML = "";
  for (i = 0; i < notesCollection.length; i++){
    let listContent = '<a href="#" class="fab-label-button '+notesCollection[i].highlight+'"><span>'+Number(i+1)+'</span><span class="fab-label">'+notesCollection[i].title+'</span></a>';
    let listDiv = document.createElement('div');
    listDiv.innerHTML = listContent;
    list.appendChild(listDiv);
  }
}



function moveUp(thisNote){

 let thisUid = thisNote.getAttribute('data-uid');
     thisIndex = findWithAttr(notesCollection, 'uid', thisUid);
     if (thisIndex>0){
     notesCollection.splice(thisIndex-1, 0,notesCollection[thisIndex]);
     notesCollection.splice(thisIndex+1, 1,);
     let notesCollectionSerialized = JSON.stringify(notesCollection);
     localStorage.setItem("notesArray", notesCollectionSerialized);
      loadNotes();
      titleList();
      highLight();
    };
}

function moveDown(thisNote){
  let thisUid = thisNote.getAttribute('data-uid');
      thisIndex = findWithAttr(notesCollection, 'uid', thisUid);
      if (thisIndex<notesCollection.length){
      notesCollection.splice(thisIndex+2, 0,notesCollection[thisIndex]);
      notesCollection.splice(thisIndex, 1);
      let notesCollectionSerialized = JSON.stringify(notesCollection);
      localStorage.setItem("notesArray", notesCollectionSerialized);
      loadNotes();
       titleList();
       highLight();
      };
 }

 function purchased(thisNote){

  let thisUid = thisNote.getAttribute('data-uid');
  let thisIndex = findWithAttr(notesCollection, 'uid', thisUid);
  let spending = document.getElementById('spending').value;
  spending = spending - notesCollection[thisIndex].cost;
  document.getElementById('spending').value = spending;
  notesCollection.splice(thisIndex, 1);
  let notesCollectionSerialized = JSON.stringify(notesCollection);
      localStorage.setItem("notesArray", notesCollectionSerialized);
  loadNotes();
  titleList();
  highLight();
 }

// This function returns a unique identifier when called.
function createUid() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
//The below function is called each submit button press to create an object with a title, timestamp and body, these are added to an array then set in localstorage
function submitNotes(spot){
  let noteObject = {};
  noteObject.body = document.getElementById('bodyInput').value;
  noteObject.title = document.getElementById('titleInput').value;
  noteObject.cost = document.getElementById('costInput').value;
  noteObject.timeStamp = '\n' + Date();
  noteObject.uid = createUid();
  noteObject.highlight = "";
  notesCollection.splice(spot, 0, noteObject);
  let notesCollectionSerialized = JSON.stringify(notesCollection);
  localStorage.setItem("notesArray", notesCollectionSerialized);
  notesCollection = JSON.parse(localStorage.getItem("notesArray"));
  loadNotes();
  titleList();
  highLight();
  htmlSwap();
};

// Below localStorage is cleared, as well as the array of note objects and the output html element.
function deleteNotes(){
  localStorage.clear("notesArray");
  notesCollection = [];
  element.innerHTML = "";
  titleList();
  htmlSwap();
};