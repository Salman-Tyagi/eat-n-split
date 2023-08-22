import { useState } from 'react';
import './style.css';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className='button'>
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function showAddFriendHander() {
    setShowAddFriend(show => !show);
  }

  function addFriendHandler(friend) {
    setFriends(friends => [...friends, friend]);
    setShowAddFriend(false);
  }

  function selectFriendHandler(friend) {
    // setSelectedFriend(friend);
    setSelectedFriend(cur => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function splitBillHandler(value) {
    console.log(value);

    setFriends(
      friends.map(friend =>
        friend.id === selectedFriend.id
          ? {
              ...friend,
              balance: friend.balance + value,
            }
          : friend
      )
    );

    setSelectedFriend(null);
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendList friends={friends} onSelection={selectFriendHandler} />

        {showAddFriend && <FormAddFriend onAddFriend={addFriendHandler} />}

        <Button onClick={showAddFriendHander}>
          {showAddFriend ? 'close' : 'Add friend'}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={splitBillHandler}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelection, selectedFriend }) {
  return (
    <div>
      <ul>
        {friends.map(friend => (
          <Friend
            friend={friend}
            key={friend.id}
            onSelection={onSelection}
            selectedFriend={selectedFriend}
          />
        ))}
      </ul>
    </div>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />

      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}

      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you ${friend.balance}{' '}
        </p>
      )}

      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function submitHandler(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    console.log(newFriend);
    onAddFriend(newFriend);

    setName('');
    setImage('https://i.pravatar.cc/48');
  }
  return (
    <form className='form-add-friend' onSubmit={submitHandler}>
      <label>👫 Friend name</label>
      <input type='text' value={name} onChange={e => setName(e.target.value)} />

      <label>📷 Image URL</label>
      <input
        type='text'
        value={image}
        onChange={e => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');

  const friendExpense = bill * 1 - paidByUser * 1;

  const [whoIsPaying, setWhoIsPaying] = useState('user');

  function inputBillHandler(e) {
    setBill(e.target.value * 1);
  }

  function inputUserHandler(e) {
    setPaidByUser(e.target.value * 1 > bill ? paidByUser : e.target.value * 1);
  }

  function toggleUserHandler(e) {
    setWhoIsPaying(e.target.value);
  }

  function submitHandler(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    onSplitBill(whoIsPaying === 'user' ? friendExpense : -paidByUser);
  }

  return (
    <form className='form-split-bill' onSubmit={submitHandler}>
      <h2>Split bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input type='text' value={bill} onChange={inputBillHandler} />

      <label>👱 Your expense</label>
      <input type='text' value={paidByUser} onChange={inputUserHandler} />

      <label>👫 {selectedFriend.name}'s expense</label>
      <input type='text' disabled value={friendExpense} />

      <label>🤑 Who is paying the bill?</label>
      <select value={whoIsPaying} onChange={toggleUserHandler}>
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}
