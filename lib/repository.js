const { getFirestore, doc, setDoc, updateDoc, arrayUnion, arrayRemove, getDoc, collection, addDoc, getDocs, query, where, deleteDoc} = require("firebase/firestore");
let db;

function initializeDB(app) {
    db = getFirestore(app);
}

async function signUpUser(user, userName){
    const userToAdd = {
        uid: user.uid,
        email: user.email, 
        userName: userName,
        favorites: new Array()
    };
    await setDoc(doc(db, "users", user.uid), userToAdd);
}

async function addUserFavorite(uid, movie){
    const userRef = doc(db,'users',uid);
    await updateDoc(userRef,{favorites: arrayUnion(movie)});
}

async function removeUserFavorite(uid, movieId, imageUrl, title){
    const userRef = doc(db,'users',uid);
    const movieToDelete = {
        movieId: movieId,
        imageUrl, imageUrl,
        title
    };
    await updateDoc(userRef,{favorites: arrayRemove(movieToDelete)});
}

async function getUserFavorites(uid){
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    return userDoc.data().favorites;
}

async function getUserInformation(uid){
    const userRef = doc(db, 'users',uid);
    const userDoc = await getDoc(userRef);
    return userDoc.data();
}

async function addUserComment(comment){
    await addDoc(collection(db, `comments/${comment.movieId}/movieComments`),comment);
    return comment;
}


async function removeUserComment(movieId, commentId){
    await deleteDoc(doc(db,`comments/${movieId}/movieComments`,commentId));
}

async function getMovieComments(movieId){
    const snapshot = await getDocs(query(collection(db, `comments/${movieId}/movieComments`), where("movieId", "==", movieId)));
    return snapshot.docs.map(x => {
        const data = x.data();
        const comment = {
            movieId: data.movieId,
            text: data.text,
            timestamp: data.timestamp,
            uid: data.uid,
            userName: data.userName,
            commentId: x.id
        };
        return comment;
    });
}

module.exports = {
    signUpUser,
    addUserFavorite,
    removeUserFavorite,
    getUserFavorites,
    getUserInformation,
    addUserComment,
    removeUserComment,
    getMovieComments,
    initializeDB
};
