import { useState } from 'react';
import { useMultiplayer } from '../../../contexts/MultiplayerContext';
import { Icon } from '../../elements/icon/Icon';
import './multiplayer-panel.scss';

export const MultiplayerPanel = () => {
  const {
    isConnected,
    isConnecting,
    currentUserId,
    currentUserColor,
    connectedUsers,
    connect,
    disconnect,
    changeUserName
  } = useMultiplayer();

  const [newName, setNewName] = useState('');
  const [showPanel, setShowPanel] = useState(false);

  const currentUser = connectedUsers.find(user => user.id === currentUserId);

  const handleNameChange = () => {
    if (newName.trim()) {
      changeUserName(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className={`multiplayer-panel ${showPanel ? 'open' : ''}`}>
      <button
        className="panel-toggle"
        onClick={() => setShowPanel(!showPanel)}
        title="Multiplayer panel"
      >
        <Icon name="users" type="fas" />
        <span className={`connection-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
      </button>

      {showPanel && (
        <div className="panel-content">
          <div className="connection-status">
            <h3>Multiplayer Status</h3>
            <div className="status-row">
              <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`} />
              <span>
                {isConnecting ? 'Připojování...' :
                  isConnected ? 'Připojeno' : 'Odpojeno'}
              </span>
              {!isConnected && !isConnecting && (
                <button onClick={connect} className="connect-btn">
                  Připojit
                </button>
              )}
              {isConnected && (
                <button onClick={disconnect} className="disconnect-btn">
                  Odpojit
                </button>
              )}
            </div>
          </div>

          {isConnected && currentUser && (
            <div className="current-user">
              <h4>Vaše informace</h4>
              <div className="user-info">
                <div
                  className="user-color"
                  style={{ backgroundColor: currentUserColor || '#333' }}
                />
                <span className="user-name">{currentUser.name}</span>
              </div>
              <div className="name-change">
                <input
                  type="text"
                  placeholder="Nové jméno"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNameChange()}
                />
                <button onClick={handleNameChange} disabled={!newName.trim()}>
                  Změnit
                </button>
              </div>
            </div>
          )}

          {isConnected && connectedUsers.length > 0 && (
            <div className="users-list">
              <h4>Připojení uživatelé ({connectedUsers.length})</h4>
              {connectedUsers.map(user => (
                <div key={user.id} className="user-item">
                  <div
                    className="user-color"
                    style={{ backgroundColor: user.color }}
                  />
                  <span className="user-name">
                    {user.name}
                    {user.id === currentUserId && ' (vy)'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
