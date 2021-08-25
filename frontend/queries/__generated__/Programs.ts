/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Programs
// ====================================================

export interface Programs_Program {
  __typename: "Program";
  Id: number;
  Name: string;
  ApplicationEnd: any | null;
  ApplicationStart: any | null;
  End: any | null;
  PerformanceRecordDeadline: any | null;
  Start: any | null;
  Visibility: boolean;
}

export interface Programs {
  /**
   * fetch data from the table: "Program"
   */
  Program: Programs_Program[];
}
