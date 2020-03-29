const clientId = '9c936a9ffce6462b9b1fb9453a8b34b4';
const redirectURI = "http://localhost:3001"
let accessToken;

export const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        } 

        //Check for Access Token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]); 
            
            // This clears the parameters, allowing us to grab a new access token.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then(response => {
                return response.json();
            }
        ).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return []
            } 
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        }); 
    },

    recommendations(track) {
        const accessToken = Spotify.getAccessToken();
        const trackId = track.id;
        return fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${trackId}&limit=10`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then(response => {
                return response.json();
            }
        ).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return []
            } 
            return jsonResponse.tracks.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        }); 
    },

    savePlaylist(playlistName, trackUris) {
        if (!playlistName || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = {
            Authorization: `Bearer ${accessToken}`
        };
        let userId;

        return fetch(`https://api.spotify.com/v1/me`, {
            headers: headers
        })
        .then(response => {
           return response.json();
        })
        .then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({name: playlistName})
            })
            .then(response => {
                return response.json();
            })
            .then(jsonResponse => {
               const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ uris: trackUris })
                })
            }) 
        })
    }
}