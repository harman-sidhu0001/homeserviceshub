// userViewModel.js

import { useState } from "react";

const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 234 567 8901",
  profilePhoto: "/assets/icons/default-profile-picture.svg",
};

const mockProjects = [
  {
    id: 1,
    name: "Kitchen Renovation",
    location: "New York",
    type: "Renovation",
    timing: "2 weeks",
    description: "Complete kitchen remodel with new cabinets and appliances.",
    requestDate: "2024-06-20",
    bookedForOther: false,
    status: "Completed",
  },
  {
    id: 2,
    name: "Plumbing Fix",
    location: "Brooklyn",
    type: "Repair",
    timing: "3 days",
    description: "Fixed leaking pipes and replaced old fixtures.",
    requestDate: "2024-06-10",
    bookedForOther: true,
    otherName: "Jane Smith",
    otherNumber: "+1 987 654 3210",
    status: "In Progress",
  },
];

const mockReviews = [
  {
    id: 1,
    serviceName: "AC Repair",
    stars: 5,
    date: "2024-06-15",
    description: "Quick and professional service! Highly recommended.",
  },
  {
    id: 2,
    serviceName: "Painting",
    stars: 4,
    date: "2024-05-30",
    description: "Good job, but arrived a bit late.",
  },
];

const mockBookmarks = [
  {
    id: 1,
    name: "Elite Plumbers",
    service: "Plumbing",
    location: "Manhattan",
    image: "/assets/images/plumber.jpg",
    providerId: "provider1",
  },
  {
    id: 2,
    name: "Bright Painters",
    service: "Painting",
    location: "Queens",
    image: "/assets/images/painter.png",
    providerId: "provider2",
  },
];

export const useUserProfile = () => {
  const [profilePhoto, setProfilePhoto] = useState(mockUser.profilePhoto);
  const [user] = useState(mockUser);
  const [projects] = useState(mockProjects);
  const [reviews] = useState(mockReviews);
  const [bookmarks, setBookmarks] = useState(mockBookmarks);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(URL.createObjectURL(file));
      // In real app, upload file to server here
    }
  };

  const onRequestService = (bookmark) => {
    alert(`Request a service from ${bookmark.name}`);
  };

  const onViewProfile = (bookmark) => {
    window.location.href = `/provider/${bookmark.providerId}`;
  };

  const onRemoveBookmark = (bookmark) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmark.id));
  };

  return {
    user,
    profilePhoto,
    handlePhotoChange,
    projects,
    reviews,
    bookmarks,
    onRequestService,
    onViewProfile,
    onRemoveBookmark,
  };
};
