let db;
let dbReq = indexedDB.open('myDatabase', 1);


/*
function addStickyNote(db, viewData) {
  // Start a database transaction and get the notes object store
  let tx = db.transaction(['notes'], 'readwrite');
  let store = tx.objectStore('notes');
  // Put the sticky note into the object store
  let note = {text: message, timestamp: Date.now()};
  store.add(note);
  // Wait for the database transaction to complete
  tx.oncomplete = function() { console.log('stored note!') }
  tx.onerror = function(event) {
    alert('error storing note ' + event.target.errorCode);
  }
}*/

function addViewToDB(db, viewData) {
	let tx = db.transaction(['views'], 'readwrite');
	let store = tx.objectStore('views');

	store.add(viewData);
	tx.oncomplete = function() { console.log('stored view'); }
	tx.onerror = function(event) { console.log(event.target.errorCode); }
} 

dbReq.onupgradeneeded = function(event) {
  // Set the db variable to our database so we can use it!  
  db = event.target.result;

  // Create an object store named notes. Object stores
  // in databases are where data are stored.
  let views = db.createObjectStore('views', {autoIncrement: true});
}
dbReq.onsuccess = function(event) {
  db = event.target.result;
}
dbReq.onerror = function(event) {
  alert('error opening database ' + event.target.errorCode);
}

function submitViewToDB(viewData) {
	addViewToDB(db, viewData);
}


function getAndDisplayViews() {
  let tx = db.transaction(['views'], 'readonly');
  let store = tx.objectStore('views');
  // Create a cursor request to get all items in the store, which 
  // we collect in the allNotes array
  let req = store.openCursor();
  let allViews = [];

  req.onsuccess = function(event) {
    // The result of req.onsuccess is an IDBCursor
    let cursor = event.target.result;
    if (cursor != null) {
      // If the cursor isn't null, we got an IndexedDB item.
      // Add it to the note array and have the cursor continue!

      // add DB Key into data to send
      var v = cursor.value;
      v["DBKey"] = cursor.primaryKey;
      console.log(v);

      allViews.push(v);
      cursor.continue();
    } else {
      // If we have a null cursor, it means we've gotten
      // all the items in the store, so display the notes we got
      pushAllViews(allViews);
    }
  }
  req.onerror = function(event) {
    alert('error in cursor request ' + event.target.errorCode);
  }
}


function deleteRecord(id) {
	let tx = db.transaction(['views'], 'readwrite');
	let store = tx.objectStore('views');
	var request = store.delete(id);
	console.log("Deleting");
	request.onsuccess = function(event) {
		console.log(event);
	}
}