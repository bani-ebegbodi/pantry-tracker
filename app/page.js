"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, TextField, Typography, Stack, Button } from "@mui/material";
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from "firebase/firestore";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);

  //Updating inventory
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  //completely deleting item from inventory
  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity >= 1) {
        await deleteDoc(docRef);
      } 
    }
    await updateInventory();
  };

  //removing 1 item from inventory
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  //adding item to inventory
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1});
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  // Adding new item with specified quantity
  const addNewItem = async (item, quantityToAdd) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    const quantity = parseInt(quantityToAdd, 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid positive number for quantity.");
      return;
    }

    if (docSnap.exists()) {
      const currentQuantity = docSnap.data().quantity;
      await setDoc(docRef, { quantity: currentQuantity + quantity });
    } else {
      await setDoc(docRef, { quantity });
    }
    await updateInventory();
  };
  

  //searching for item
  const handleSearch = () => {
    if (searchQuery.trim()) {
      const filteredInventory = inventory.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setInventory(filteredInventory);
    } else {
      updateInventory();
    }
  };
  

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
   

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection = "column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{
        backgroundImage: 'url("/wood.jpg")',
        position: 'relative'
      }}

      >
        <Box
        display="flex"
        flexDirection = "column"
        justifyContent="center"
        alignItems="center"
        gap={2}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white', 
          zIndex: 1,
        }}
      >
      <Modal
        open = {open}
        onClose = {handleClose}>
        <Box
        position = "absolute"
        top = "50%"
        left = "50%"
        width = {400}
        bgcolor = "white"
        border = "2px solid #000"
        boxShadow = {24}
        p = {4}
        display = "flex"
        flexDirection = "column"
        gap = {3}
        sx = {{
          transform: 'translate(-50%, -50%)',
        }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
            variant="outlined"
            width="50%"
            label="Name"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value)
            }}/>
            <TextField
            variant="outlined"
            width="50%"
            label="Quantity"
            type="number"
            value={itemQuantity}
            onChange={(e) => {
              const value = e.target.value;
              if (!isNaN(value) && Number(value) > 0) {
                setItemQuantity(Number(value));
              } else {
                setItemQuantity(""); 
              }
            }}
            inputProps={{ min: 1 }}
            />
            <Button 
              variant="outlined" 
              onClick={() => {
                addNewItem(itemName, itemQuantity)
                handleClose();
              }}>
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="row" spacing={2} alignItems="center">
        <Button 
        variant="contained" 
        sx={{
          backgroundColor: '#bc6c25', 
          '&:hover': {
            backgroundColor: '#dda15e', 
          },
        }}
        onClick={() => {
          handleOpen()
        }}>
          Add New Item
        </Button>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            variant="outlined"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{
              backgroundColor: '#f0f0f0', 
            }}
          />
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#bc6c25', 
              '&:hover': {
                backgroundColor: '#dda15e', 
              },
            }}
            onClick={handleSearch}
            startIcon={<SearchRoundedIcon />}
          >
            Search
          </Button>
        </Stack>
      </Stack>
      <Box border = "1px solid #333">
        <Box
        width = "800px"
        height = "100px"
        bgcolor = "#335145"
        alignItems = "center"
        display = "flex"
        justifyContent = "center">
          <Typography variant="h2" color="#fff">
            Pantry Tracker
          </Typography>
        </Box>
      <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {
          inventory.map(({name, quantity}) => (
            <Box 
            key={name} 
            width="100%" 
            minHeight="150px" 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between"
            bgcolor="#aac3c5"
            padding = {5}>
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
              <Button
              variant="contained"
              sx={{
                backgroundColor: '#283618', 
                '&:hover': {
                  backgroundColor: '#606c38', 
                },
              }}
              startIcon={<AddRoundedIcon/>}
              onClick = {() => {
                addItem(name)
              }}>
                Add
              </Button>
              <Button
              variant="contained"
              sx={{
                backgroundColor: '#283618', 
                '&:hover': {
                  backgroundColor: '#606c38', 
                },
              }}
              startIcon={<RemoveRoundedIcon/>}
              onClick = {() => {
                removeItem(name)
              }}>
                Remove
              </Button>
              <Button
              variant="contained"
              sx={{
                backgroundColor: '#283618', 
                '&:hover': {
                  backgroundColor: '#606c38', 
                },
              }}
              startIcon={<DeleteRoundedIcon />}
              onClick = {() => {
                deleteItem(name)
              }}>
                Trash
              </Button>
              </Stack>
            </Box>
          ))
          }
      </Stack>
      </Box>
      </Box>
    </Box>
  );
}
