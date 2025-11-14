# Slate - Gesture-Enhanced Task Manager

A modern, gesture-driven task management application built with React Native and Expo.

## Features

### Core Functionality
- Create, edit, and delete tasks
- Assign priority levels (High, Medium, Low)
- Categorize tasks (Work, Personal, Study)
- Set due dates for tasks
- Sort tasks by priority and due date
- Local storage persistence

### Gesture Interactions
- **Swipe Actions**
  - Swipe right to mark task as complete/incomplete
  - Swipe left to reveal delete option
  - Haptic feedback for satisfying interaction

- **Drag-and-Drop Reordering**
  - Long press and drag to reorder tasks
  - Animated transitions for natural feel
  - Haptic feedback when crossing task boundaries

- **Tap & Long Press**
  - Tap checkbox to toggle completion status
  - Long press on task to open edit modal
  - Subtle scale animations for visual feedback

## Technical Implementation

### Libraries Used
- `react-native-gesture-handler` - For advanced gesture recognition
- `react-native-reanimated` - For fluid, performant animations
- `expo-haptics` - For tactile feedback
- `@react-native-async-storage/async-storage` - For data persistence

### Key Components
- **TaskItem** - Swipeable task component with animations
- **DraggableTaskList** - Drag-and-drop enabled task list

## Getting Started

### Prerequisites
- Node.js
- Expo CLI
- iOS/Android simulator or physical device

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Follow the instructions to open the app on your device or simulator

## Usage

- **Add Task**: Tap the + button to create a new task
- **Complete Task**: Swipe right on a task or tap the checkbox
- **Delete Task**: Swipe left on a task to reveal delete option
- **Edit Task**: Long press on a task to open edit modal
- **Reorder Tasks**: Long press and drag to reorder tasks
- **Clear All**: Tap the delete icon in the header to clear all tasks

## Design Philosophy

Slate is designed to be minimal yet powerful, with a focus on natural, intuitive interactions. The gesture-based interface reduces UI clutter while providing a premium, fluid experience that makes task management feel effortless.

The app follows these UX principles:
- **Immediate feedback** - Visual and haptic responses to user actions
- **Predictable interactions** - Consistent gesture behaviors
- **Fluid animations** - Smooth transitions that feel natural
- **Minimalist design** - Focus on content over UI elements
