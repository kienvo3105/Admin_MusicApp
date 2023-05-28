import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
// import { Link } from 'react-router-dom';
import { Singer } from './page/singer/Singer';
import { Album } from './page/album/Album';
import { Sidebars } from './sidebar/Sidebar';
import { Song } from './page/song/Song';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Sidebars>
              <h1>Welcome to the Home page</h1>
            </Sidebars>
          }
        />
        <Route
          path="/singer"
          element={
            <Sidebars>
              <Singer />
            </Sidebars>
          }
        />
        <Route
          path="/album"
          element={
            <Sidebars>
              <Album />
            </Sidebars>
          }
        />
        <Route
          path="/song"
          element={
            <Sidebars>
              <Song />
            </Sidebars>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
