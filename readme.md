# Christopher's Kitchen
## Name: Olona Wele, ST1047760
🍽 Christopher's Kitchen Menu Management App

# Overview

This is a single-screen application designed for restaurant staff (like chefs or managers) to efficiently manage, track, and analyze the current menu offerings for "Christopher's Kitchen." It provides a clear overview of all dishes, calculated pricing insights, and a dedicated interface for adding or removing items.

# Key Features

Home Screen (Menu Display)

Menu List: View all current menu items with their name, course, description, and price.

Pricing Analytics: Displays the Average Price for Starters, Mains, and Desserts, calculated in real-time based on the current menu items.

Course Filtering: Use the dropdown selector to filter the main menu list to show only items belonging to a specific course (Starters, Mains, or Dessert).

Item Removal: Easily remove any item directly from the list using the trash can icon.

Bulk Actions: A Clear All button is available for a complete menu reset.

Add Screen (Manage Menu)

Dedicated Input: A separate, focused screen accessed via the "Manage Menu" button.

Required Fields: Input fields for the Dish Name, Description, Course (using a picker), and Price.

Validation: Ensures a dish name is entered and the price is a valid positive number before saving.

Navigation: Seamless return to the main menu view upon saving or using the "Back to Menu" button.

# Usage Instructions

View Menu: The app opens directly to the menu list. Use the Course Filter to narrow down the view.

Add a New Item: Click the "Manage Menu" button.

Fill in all fields (Name, Description, Course, Price).

Click "Add Item" to save it and return to the main list.

 Delete an Item:

To delete a specific item, click the trash icon (🗑) next to it on the main menu list.

To quickly remove the last item added, go to the "Manage Menu" screen and use the "Delete Last" button.

# Change Log (Recent Updates - November 2025)

## Core Management & Navigation:

Implemented the Full Management Workflow, allowing seamless navigation between the main Menu Display (Home) and the item Add/Input screen (Add).

Added Form Validation to ensure new items cannot be added without a name and a valid numeric price.

## Menu Insights & Filtering:

Introduced Real-Time Analytics to calculate and display the Average Price for each course (Starters, Mains, Dessert) dynamically.

Implemented Menu Filtering, giving users the ability to filter the menu list by Course (Starters, Mains, Dessert, or All) directly on the Home Screen.

## Usability & UI:

Added Individual Item Removal via a trash icon (🗑) next to each item for quick deletion, enhancing management efficiency.

Enhanced Visual Clarity by adjusting the content overlay transparency to make the background kitchen image more visible.