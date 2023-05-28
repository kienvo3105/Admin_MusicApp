import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase'
import { doc, addDoc, getDocs, collection, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import './Album.css'

export const Album = () => {
    const [image, setImage] = useState('');
    const [albumName, setAlbumName] = useState('');
    const [selectedArtist, setSelectedArtist] = useState('');
    const [inputKey, setInputKey] = useState(Date.now());
    const [artistList, setArtistList] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [albumList, setAlbumList] = useState([]);
    const [publics, setPublics] = useState();
    //fetch singer
    useEffect(() => {
        const getSinger = async () => {
            const querySnapshot = await getDocs(collection(db, "artists"));
            const artist = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name,
            }));
            setArtistList(artist);
        }


        getSinger();
    }, [])

    //fetch album
    useEffect(() => {
        const getAlbum = async () => {
            const querySnapshot = await getDocs(collection(db, "albums"));
            const albumList = [];

            for (const docRef of querySnapshot.docs) {
                const albumData = docRef.data();

                // Lấy tên ca sĩ từ reference
                const artistRef = albumData.singer;
                const artistDoc = await getDoc(artistRef);
                const artistData = artistDoc.data();
                const artistName = artistData.name;

                // Thêm thông tin album vào danh sách
                const album = {
                    id: docRef.id,
                    name: albumData.name,
                    image: albumData.image,
                    signer: artistName,
                    public: albumData.public,
                };
                albumList.push(album);
            }
            console.log(albumList)
            setAlbumList(albumList);
        };
        getAlbum();
    }, [inputKey])


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };

    const handleUploadImage = () => {
        if (image) {
            const storageRef = ref(storage, `/album_image/${image.name}`);

            uploadBytes(storageRef, image).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    console.log(url);
                    setImageUrl(url);
                });
            });
        };
    };

    const handleAlbumNameChange = (event) => {
        setAlbumName(event.target.value);
    };

    const handleArtistChange = (event) => {
        setSelectedArtist(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log('Thông tin album:', {
            imageUrl,
            albumName,
            selectedArtist: selectedArtist,
        });

        const docRef = await addDoc(collection(db, "albums"), {
            name: albumName,
            image: imageUrl,
            singer: doc(db, `artists/${selectedArtist}`),
            public: publics
        });

        console.log("Document written with ID: ", docRef.id);
        setImage('');
        setAlbumName('');
        setSelectedArtist('');
        setImageUrl('');
        setInputKey(Date.now());
    };
    const handlePublicChange = (event) => {
        setPublics(event.target.value);
    }

    return (
        <div className="container">
            <h1>Add Album</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Tên album:</label>
                    <input type="text" value={albumName} onChange={handleAlbumNameChange} className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor="public">Public:</label>
                    <input type="number" id="public" value={publics} onChange={handlePublicChange} className="form-input" />
                </div>
                <div className="form-group">
                    <label>Thêm ảnh cho album:</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="form-input" key={inputKey} />
                    <button type="button" onClick={handleUploadImage}>
                        Upload Image
                    </button>
                    {imageUrl !== '' &&
                        <div><img src={imageUrl} alt="Album_upload" className="singer-image" /></div>}
                </div>
                <div className="form-group">
                    <label>Chọn danh sách ca sĩ:</label>
                    <select value={selectedArtist} onChange={handleArtistChange} className="form-input">
                        <option value="">-- Chọn ca sĩ --</option>
                        {artistList.map((artist) => (
                            <option key={artist.id} value={artist.id}>
                                {artist.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="form-button">Thêm album</button>
            </form>


            <h2>Album List</h2>
            <ul className="singer-list">
                {albumList.map((album) => (
                    <li key={album.id}>
                        <div>
                            <strong className="singer-name">Name:</strong> {album.name}
                        </div>
                        <div>
                            <strong>Image:</strong> <img src={album.image} alt="Singer" className="singer-image" />
                        </div>
                        <div>
                            <strong>signer:</strong> {album.signer}
                        </div>
                        <div>
                            <strong>public:</strong> {album.public}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
