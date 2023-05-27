import React, { useState, useEffect } from 'react'
import { db, storage } from '../../firebase'
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import "./Singer.css"

export const Singer = () => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [singerId, setSingerId] = useState('');
    const [followers, setFollowers] = useState(0);
    const [imageUrl, setImageUrl] = useState('');
    const [inputKey, setInputKey] = useState(Date.now());

    const [singers, setSingers] = useState([]);

    useEffect(() => {
        // const singer_list = [];
        const getData = async () => {
            const querySnapshot = await getDocs(collection(db, "artists"));
            const singer_list = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
                image: doc.data().image,
                followers: doc.data().follower
            }));
            setSingers(singer_list);
        }
        getData();
        // setSingers(singer_list);
        // console.log(singer_list);
    }, [inputKey])

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    const handleSingerIdChange = (event) => {
        setSingerId(event.target.value);
    };

    const handleFollowersChange = (event) => {
        setFollowers(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Perform the necessary action to save the data
        await setDoc(doc(db, "artists", singerId), {
            name: name,
            image: imageUrl,
            follower: followers,
        });

        // Reset the form after submitting
        setName('');
        setImage(null);
        setSingerId('');
        setFollowers(0);
        setInputKey(Date.now());
        setImageUrl('')
    };

    const handleUploadImage = () => {
        if (image) {
            const storageRef = ref(storage, `/artists/${image.name}`);

            uploadBytes(storageRef, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    console.log(url);
                    setImageUrl(url);
                });
            });
        };
    };

    return (
        <div>
            <h1>Add Singer</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="singerId">Singer ID:</label>
                    <input
                        type="text"
                        id="singerId"
                        value={singerId}
                        onChange={handleSingerIdChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={handleNameChange}
                        className="form-input"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                        className="form-input"
                        key={inputKey}
                    />
                    <button type="button" onClick={handleUploadImage}>
                        Upload Image
                    </button>
                    {imageUrl !== '' &&
                        <div><img src={imageUrl} alt="Singer_upload" className="singer-image" /></div>}
                </div>

                <div className="form-group">
                    <label htmlFor="followers">Followers:</label>
                    <input
                        type="number"
                        id="followers"
                        value={followers}
                        onChange={handleFollowersChange}
                        className="form-input"
                    />
                </div>
                <button type="submit" className="form-button">Add Singer</button>
            </form>

            <h2>Singer List</h2>
            <ul className="singer-list">
                {singers.map((singer) => (
                    <li key={singer.id}>
                        <div>
                            <strong className="singer-name">Name:</strong> {singer.name}
                        </div>
                        <div>
                            <strong>Image:</strong> <img src={singer.image} alt="Singer" className="singer-image" />
                        </div>
                        <div>
                            <strong>Followers:</strong> {singer.followers}
                        </div>
                    </li>
                ))}
            </ul>
        </div >
    );
}
