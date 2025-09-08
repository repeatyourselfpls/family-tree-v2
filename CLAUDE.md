# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Family Tree v2 is a React + TypeScript application for interactive family tree visualization using React Flow (@xyflow/react). The project implements a modified Reingold-Tilford Algorithm for tree layout with support for multiple spouses and infinite descendants.

## Development Commands

```bash
# Install dependencies (use pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Run ESLint
pnpm lint

# Preview production build
pnpm preview
```

## Architecture

### Core Components Structure

- **TreeModel/** - Contains the tree data structure and layout algorithms
  - `TreeModel.ts` - Main tree model with node management and layout logic
  - `TreeNode.ts` - Node class definition
  - `TreeUtils.ts` - Utility functions for tree operations
  - Uses modified Reingold-Tilford Algorithm for symmetrical tree layout

- **components/** - React components
  - `BridgeNode.tsx` - Invisible connector nodes for multiple spouses
  - `GenericNode.tsx` - Main person node component with click/edit functionality
  - `Sidebar.tsx` - Detail view/edit panel (name, spouse info, add descendants)
  - `SpouseNode.tsx` - Spouse node component
  - `types.ts` - TypeScript type definitions

- **context/** - State management
  - `TreeContext.tsx` - React context providing tree state and operations across components

### Key Architectural Patterns

1. **Tree Layout Algorithm**: Modified Reingold-Tilford with custom spacing logic for spouses and descendants
2. **Node Types**: Three distinct node types (main, spouse, bridge) handled by React Flow
3. **State Management**: Context API for sharing tree state between components
4. **Event Handling**: Node clicks trigger sidebar for viewing/editing details

### Data Flow

1. Tree structure maintained in TreeModel
2. Layout calculations generate React Flow nodes/edges
3. Context provides tree operations (add nodes, update names, etc.)
4. Components interact with tree via context methods
5. Sidebar component handles user input for modifications

## Important Implementation Details

- Spouse nodes are connected via invisible bridge nodes for proper layout
- Node IDs follow pattern: main nodes (numeric), spouses (s_parentId_index), bridges (b_parentId_spouseIndex)
- Tree automatically centers on initial load and after modifications
- CSS variables intended for future dynamic node scaling (not yet implemented)

# Claude Instructions
All code updates and modifications must be fed in a didactic manner so that the user **LEARNS**. The purpose of this repository is not only to just build an app that can be used to depict family trees, but also as a learning experiment for the user.

Unless explicitly specified to write code, any user instruction for Claude on improvements must result in a master-pupil, socratic style that encourages the user to write the own code. Claude's purpose should solely be to teach, nudge the user in the right direction (code samples are fine).