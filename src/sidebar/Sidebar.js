import React from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
export const Sidebars = ({ children }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar>
                <Menu
                    menuItemStyles={{
                        button: ({ level, active, disabled }) => {
                            // only apply styles on first level elements of the tree
                            if (level === 0)
                                return {
                                    color: disabled ? '#f5d9ff' : '#d359ff',
                                    backgroundColor: active ? '#eecef9' : undefined,
                                };
                        },
                    }}
                >
                    <MenuItem component={<Link to="/singer" />}>Singer</MenuItem>
                    <MenuItem component={<Link to="/album" />}>Album</MenuItem>
                    <MenuItem component={<Link to="/song" />}>Song</MenuItem>
                </Menu>
            </Sidebar>
            <div style={{ flex: 1, padding: '20px' }}>{children}</div>
        </div>
    )
}

