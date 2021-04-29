let db;
let dbReq = indexedDB.open('myDatabase', 3);


dbReq.onupgradeneeded = function (event) {
    // Set the db variable to our database so we can use it!  
    db = event.target.result;

    // Create an object store named notes. Object stores
    // in databases are where data are stored.
    let notes = db.createObjectStore('app-view-story', { autoIncrement: true, keyPath: "id" });
    notes.onerror = (e) => {
        db.deleteObjectStore("app-view-story")
        db.createObjectStore('app-view-story', { autoIncrement: true, keyPath: "id" });
    }
}
dbReq.onsuccess = function (event) {
    db = event.target.result;
}

dbReq.onerror = function (event) {
    alert('error opening database ' + event.target.errorCode);
}
export const addData = (id, value) => {
    let tx = db.transaction(['app-view-story'], 'readwrite');
    let store = tx.objectStore('app-view-story');
    let req = store.add(value)
    req.onsuccess = (e) => {
        console.log("succesFull")
    }
    req.onerror = (e) => {
        console.log("failure")
    }
}
export const deleteData = (id) => {
    let tx = db.transaction(['app-view-story'], 'readwrite');
    let store = tx.objectStore('app-view-story');
    let req = store.delete(id)
    req.onerror = (e) => {
        console.log("Does not exists")
    }
}