const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearItem = document.getElementById('clear');
const filter = document.getElementById('filter');

// state for editing
let isEditing = false;
let itemToEdit = null;

// Event listeners
document.addEventListener('DOMContentLoaded', getItemsFromLocalStorage);
itemForm.addEventListener('submit', addItem);
itemList.addEventListener('click', handleItemClick);
clearItem.addEventListener('click', itemClear);
filter.addEventListener('input', filterItem);

// Add item or update existing
function addItem(e) {
  e.preventDefault();
  const newItem = itemInput.value.trim();

  if (newItem === '') {
    alert('Please add an item');
    return;
  }

  // if we are editing
  if (isEditing && itemToEdit) {
    const oldItem = itemToEdit.firstChild.textContent;
    itemToEdit.firstChild.textContent = newItem;
    updateLocalStorage(oldItem, newItem);

    // reset edit mode
    isEditing = false;
    itemToEdit = null;
    document.querySelector('#item-form button').textContent = 'Add Item';
  } else {
    // create new list item
    const li = document.createElement('li');
    li.textContent = newItem;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.className = 'delete-btn';

    const edtbtn = document.createElement('button');
    edtbtn.textContent = 'Edit';
    edtbtn.className = 'edit-btn';

    li.appendChild(delBtn);
    li.appendChild(edtbtn);
    itemList.appendChild(li);

    saveToLocalStorage(newItem);
  }

  itemInput.value = '';
}

// handle clicks on delete/edit
function handleItemClick(e) {
  if (e.target.classList.contains('delete-btn')) {
    removeItem(e);
  } else if (e.target.classList.contains('edit-btn')) {
    editItem(e);
  }
}

// remove one item
function removeItem(e) {
  if (confirm('Are you sure you want to delete this item?')) {
    const li = e.target.parentElement;
    const itemText = li.firstChild.textContent.trim();
    itemList.removeChild(li);
    removeFromLocalStorage(itemText);
  }
}

// clear all items
function itemClear() {
  if (confirm('Are you sure you want to delete all items?')) {
    itemList.innerHTML = '';
    localStorage.removeItem('items');
  }
}

// filter list items
function filterItem(e) {
  const text = e.target.value.toLowerCase();
  const items = itemList.getElementsByTagName('li');

  Array.from(items).forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase().trim();
    if (itemName.indexOf(text) !== -1) {
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

// save to local storage
function saveToLocalStorage(item) {
  let items = JSON.parse(localStorage.getItem('items')) || [];
  items.push(item);
  localStorage.setItem('items', JSON.stringify(items));
}

// get items from local storage
function getItemsFromLocalStorage() {
  let items = JSON.parse(localStorage.getItem('items')) || [];
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'X';
    delBtn.className = 'delete-btn';

    const edtbtn = document.createElement('button');
    edtbtn.textContent = 'Edit';
    edtbtn.className = 'edit-btn';

    li.appendChild(delBtn);
    li.appendChild(edtbtn);
    itemList.appendChild(li);
  });
}

// remove from local storage
function removeFromLocalStorage(item) {
  let items = JSON.parse(localStorage.getItem('items')) || [];
  items = items.filter((i) => i !== item);
  localStorage.setItem('items', JSON.stringify(items));
}

// update item in local storage
function updateLocalStorage(oldItem, newItem) {
  let items = JSON.parse(localStorage.getItem('items')) || [];
  const index = items.indexOf(oldItem);
  if (index !== -1) {
    items[index] = newItem;
    localStorage.setItem('items', JSON.stringify(items));
  }
}

// edit existing item
function editItem(e) {
  const li = e.target.parentElement;
  itemInput.value = li.firstChild.textContent;
  itemToEdit = li;
  isEditing = true;
  document.querySelector('#item-form button').textContent = 'Update Item';
}
