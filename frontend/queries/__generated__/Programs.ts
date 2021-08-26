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
  ShortName: string | null;
  QuestionnaireStart: string | null;
  QuestionnaireEnd: string | null;
  QuestionnaireSpeaker: string | null;
  FileNameTemplateParticipationCertificate: string | null;
  FileNameTemplatePerformanceCertificate: string | null;
  FileLinkTemplateParticipationCertificate: string | null;
  FileLinkTemplatePerformanceCertificate: string | null;
  MaxMissedSessions: number | null;
  VisiblityParticipationCertificate: boolean | null;
  VisibilityPerformanceCertificate: boolean | null;
}

export interface Programs {
  /**
   * fetch data from the table: "Program"
   */
  Program: Programs_Program[];
}
