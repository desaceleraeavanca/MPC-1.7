# AI Development Rules

This document provides guidelines for the AI assistant to follow when developing and modifying this web application. Adhering to these rules ensures consistency, maintainability, and adherence to the project's architectural standards.

## Tech Stack

The application is built with a modern, lightweight tech stack:

-   **Framework**: React 19 with TypeScript for robust, type-safe components.
-   **Build Tool**: Vite for fast development and optimized builds.
-   **Styling**: Tailwind CSS is used exclusively for all styling. It's loaded via a CDN in `index.html`.
-   **UI Components**: The app uses a custom set of components inspired by shadcn/ui. New components should follow this pattern.
-   **Icons**: Icons are provided via a custom `src/components/Icons.tsx` file, based on the `lucide-react` library.
-   **State Management**: State is managed locally with React Hooks (`useState`, `useMemo`, `useEffect`).
-   **Data Persistence**: Application state (user data, settings, etc.) is persisted in the browser's `localStorage`.
-   **Routing**: A simple, state-based routing system is managed within the main `App.tsx` component to switch between different views.

## Library and Coding Guidelines

### UI Components

-   **Primary Source**: Before creating a new component, check if a similar one already exists in `src/components/`.
-   **Styling**: All components MUST be styled using Tailwind CSS classes. Avoid custom CSS files or inline `style` attributes unless absolutely necessary for dynamic properties.
-   **File Structure**: Every new component must be in its own file inside the `src/components/` directory.

### Icons

-   **Usage**: All icons must be imported from `src/components/Icons.tsx`.
-   **Adding Icons**: If a new icon is needed, add its SVG definition to `Icons.tsx` and export it, following the existing pattern. Do not install new icon libraries.

### State Management

-   **Local State**: Use `useState` and `useEffect` for component-level state.
-   **Global State**: The main `App.tsx` component acts as the central state manager. Lift state up to `App.tsx` when it needs to be shared between different views or major components.
-   **Persistence**: All user-specific or globally configured state that needs to persist across sessions MUST be saved to `localStorage` using the existing `getInitialState` helper and `useEffect` hooks in `App.tsx`.

### Modals and Popups

-   **Implementation**: All modals or floating UI elements that need to break out of their parent container should be implemented using `ReactDOM.createPortal`, following the pattern established in `UpgradeModal.tsx` and the `NotesModal` in `Dashboard.tsx`.

### Code Style and Structure

-   **Types**: All custom types should be defined in the central `types.ts` file.
-   **Constants**: Static data, such as the book content (`BOOK_CONTENT`), should be stored in `constants.tsx`.
-   **Simplicity**: Keep the architecture simple. Do not introduce new libraries (e.g., for routing, state management, or data fetching) without explicit user permission. The goal is to maintain a minimal and easy-to-understand codebase.