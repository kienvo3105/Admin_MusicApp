import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { collection, getDocs, getDoc, setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Select from 'react-select'
// import './Song.css';


function convertToLowerCaseNoDiacriticAndRemoveSpaces(str) {
    const withDiacritic = "àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ";
    const withoutDiacritic = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd";

    let result = "";

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const index = withDiacritic.indexOf(char);

        if (index !== -1) {
            result += withoutDiacritic[index];
        } else if (char === " ") {
            continue;
        } else {
            result += char.toLowerCase();
        }
    }

    return result;
}

export const Song = () => {
    const [primaryArtist, setPrimaryArtist] = useState('');
    // const [featuredArtists, setFeaturedArtists] = useState([]);
    const [album, setAlbum] = useState('');
    const [genres, setGenres] = useState([]);
    const [image, setImage] = useState(null);
    const [lyrics, setLyrics] = useState(null);
    const [name, setName] = useState('');
    const [audio, setAudio] = useState(null);
    const [views, setViews] = useState(0);
    const [inputKey, setInputKey] = useState(Date.now());
    const [artists, setArtists] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [allGenres, setAllGenres] = useState([]);
    const [selectAlbum, setSelectAlbum] = useState([]);
    const [publics, setPublics] = useState(0);
    const [selectedSingerOption, setSelectedSingerOption] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            // get artist
            const artistSnapshot = await getDocs(collection(db, 'artists'));
            const artistsData = artistSnapshot.docs.map((doc) => ({
                value: doc.id,
                label: doc.data().name,
            }));
            setArtists(artistsData);

            // get album
            const albumSnapshot = await getDocs(collection(db, 'albums'));
            const albumList = [];

            for (const docRef of albumSnapshot.docs) {
                const albumData = docRef.data();

                // Lấy tên ca sĩ từ reference
                const artistRef = albumData.singer;
                const artistDoc = await getDoc(artistRef);
                const artistData = artistDoc.id;
                // Thêm thông tin album vào danh sách
                const album = {
                    id: docRef.id,
                    name: albumData.name,
                    image: albumData.image,
                    singer: artistData,
                };
                albumList.push(album);
            }
            setAlbums(albumList);

            // get genre
            const genreSnapshot = await getDocs(collection(db, 'genre'));
            const genresData = genreSnapshot.docs.map((doc) => ({
                value: doc.id,
                label: doc.data().name,
            }));
            setAllGenres(genresData);

            //get song
            const querySnapshot = await getDocs(collection(db, "songs"));
            let songsArray = [];
            for (const docRef of querySnapshot.docs) {
                const songData = docRef.data();

                // get singer
                const signer = await getDoc(songData.artists[0]);
                //get album
                const album = await getDoc(songData.album);
                //object song
                const song = {
                    id: docRef.id,
                    name: songData.name,
                    uri: songData.uri,
                    lyric: songData.lyric,
                    image: songData.image,
                    public: songData.public,
                    singer: signer.data().name,
                    idSinger: signer.id,
                    idAlbum: album.id,
                }
                console.log(song)
                songsArray.push(song);

            }
            console.log(songsArray);


        };
        fetchData();

    }, []);

    const handlePrimaryArtistChange = (event) => {
        setPrimaryArtist(event.target.value);
        const filter_album = albums.filter((element) => element.singer === event.target.value);
        setSelectAlbum(filter_album);
    };

    // const handleFeaturedArtistsChange = (event) => {
    //     const selectedArtists = Array.from(event.target.selectedOptions, (option) => option.value);
    //     setFeaturedArtists(selectedArtists);
    // };

    const handleAlbumChange = (event) => {
        setAlbum(event.target.value);
    };

    // const handleGenresChange = (event) => {
    //     const selectedGenres = Array.from(event.target.selectedOptions, (option) => option.value);
    //     setGenres(selectedGenres);
    // };

    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleLyricsChange = (event) => {
        setLyrics(event.target.files[0]);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleAudioChange = (event) => {
        setAudio(event.target.files[0]);
    };

    const handleViewsChange = (event) => {
        setViews(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Perform the necessary action to save the data
        // ...
        // Upload image
        let imageUrl = '';
        if (image) {
            const storageRef = ref(storage, `/music_image/${primaryArtist}/${image.name}`);
            await uploadBytes(storageRef, image);
            imageUrl = await getDownloadURL(storageRef);
        }

        // Upload lyrics
        let lyricsUrl = '';
        if (lyrics) {
            const storageRef = ref(storage, `/lyrics/${primaryArtist}/${lyrics.name}`);
            await uploadBytes(storageRef, lyrics);
            lyricsUrl = await getDownloadURL(storageRef);
        }

        // Upload audio
        let audioUrl = '';
        if (audio) {
            const storageRef = ref(storage, `/musics/${primaryArtist}/${audio.name}`);
            await uploadBytes(storageRef, audio);
            audioUrl = await getDownloadURL(storageRef);
        }

        //reference artist
        const artistFeat = selectedSingerOption?.map((item) => doc(db, `artists/${item.value}`))

        const artistList = artistFeat && artistFeat.length > 0 ? [doc(db, `artists/${primaryArtist}`), ...artistFeat] : [doc(db, `artists/${primaryArtist}`)];

        //reference genre
        const genreList = genres.map((item) => doc(db, `genre/${item.value}`))

        // Prepare data to save
        const songData = {
            name: name,
            artists: artistList,
            genre: genreList,
            album: doc(db, `album/${album}`),
            image: imageUrl,
            lyric: lyricsUrl,
            url: audioUrl,
            view: parseInt(views),
            public: parseInt(publics)
        };

        const idSong = convertToLowerCaseNoDiacriticAndRemoveSpaces(name) + `_${primaryArtist}`;
        // Save song data to Firestore
        await setDoc(doc(db, `songs/${idSong}`), songData);

        // Reset the form after submitting
        setPrimaryArtist('');
        // setFeaturedArtists([]);
        setAlbum('');
        setGenres([]);
        setImage(null);
        setLyrics(null);
        setName('');
        setAudio(null);
        setViews(0);
        setSelectedSingerOption([]);
        setInputKey(Date.now());
        setPublics(0);

    };

    const handlePublicChange = (event) => {
        setPublics(event.target.value);
    }

    return (
        <div>
            <h1>Add Song</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={handleNameChange} className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor="public">Public:</label>
                    <input type="number" id="public" value={publics} onChange={handlePublicChange} className="form-input" />
                </div>
                <div className="form-group">
                    <label htmlFor="primaryArtist">Primary Artist:</label>
                    <select id="primaryArtist" value={primaryArtist} onChange={handlePrimaryArtistChange} className="form-input" key={inputKey}>
                        <option value="">Select Primary Artist</option>
                        {artists.map((artist) => (
                            <option key={artist.value} value={artist.value}>
                                {artist.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="featuredArtists">Featured Artists:</label>
                    <Select
                        isMulti
                        id="featuredArtists"
                        options={artists}
                        onChange={setSelectedSingerOption}
                        defaultValue={selectedSingerOption}

                    />
                </div>
                <div className="form-group">
                    <label htmlFor="album">Album:</label>
                    <select id="album" value={album} onChange={handleAlbumChange} className="form-input" key={inputKey}>
                        <option value="">Select Album</option>
                        {selectAlbum.map((album) => (
                            <option key={album.id} value={album.id}>
                                {album.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="genres">Genres:</label>
                    <Select id="genres" options={allGenres} onChange={setGenres} defaultValue={genres} isMulti />
                </div>
                <div className="form-group">
                    <label htmlFor="image">Image:</label>
                    <input type="file" id="image" onChange={handleImageChange} className="form-input" key={inputKey} />
                </div>
                <div className="form-group">
                    <label htmlFor="lyrics">Lyrics:</label>
                    <input type="file" id="lyrics" onChange={handleLyricsChange} className="form-input" key={inputKey} />
                </div>

                <div className="form-group">
                    <label htmlFor="audio">Audio:</label>
                    <input type="file" id="audio" onChange={handleAudioChange} className="form-input" key={inputKey} />
                </div>
                <div className="form-group">
                    <label htmlFor="views">Views:</label>
                    <input type="number" id="views" value={views} onChange={handleViewsChange} className="form-input" />
                </div>
                <button type="submit" className="form-button">
                    Add Song
                </button>
            </form>
        </div>
    );
};
