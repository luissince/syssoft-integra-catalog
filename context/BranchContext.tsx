"use client";

import { Branch } from "@/types/api-type";
import {
  createContext,
  useContext,
  ReactNode,
  useState,
} from "react";

interface BranchContextType {
  branches: Branch[];
  branch: Branch;
  setBranch: (branch: Branch) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(
  undefined
);

interface BranchProviderProps {
  children: ReactNode;
  initialBranches: Branch[];
}

export function BranchProvider({
  children,
  initialBranches,
}: BranchProviderProps) {

  const [branches] = useState<Branch[]>(initialBranches);

  const primaryBranch = branches.find(
    (branch) => branch.primary === true
  )!;

  const [branch, setBranch] = useState<Branch>(primaryBranch);

  return (
    <BranchContext.Provider
      value={{
        branches,
        branch,
        setBranch,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);

  if (!context) {
    throw new Error(
      "useBranch debe usarse dentro de un BranchProvider"
    );
  }

  return context;
}