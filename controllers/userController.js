import User from '../models/userModel.js';

export const addUser = async (req, res) => {
  try {
    console.log("File uploaded:", req.file);  // Debugging step
    console.log("Form data:", req.body);
    const { fullName, email, phone, status } = req.body;
    const profileImage = req.file?.path;
    
    const newUser = new User({ fullName, email, phone, status,profileImage });
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { fullName, email, phone, status } = req.body;
    const profileImage = req.file?.path;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      fullName, email, phone, status, profileImage
    }, { new: true });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};    

export const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
