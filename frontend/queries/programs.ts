import { gql } from "@apollo/client";

export const PROGRAMS = gql`
  query Programs {
    Program {
      Id
      Name
      ApplicationEnd
      ApplicationStart
      End
      PerformanceRecordDeadline
      Start
      Visibility
      ShortName
      QuestionnaireStart
      QuestionnaireEnd
      QuestionnaireSpeaker
      FileNameTemplateParticipationCertificate
      FileNameTemplatePerformanceCertificate
      FileLinkTemplateParticipationCertificate
      FileLinkTemplatePerformanceCertificate
      MaxMissedSessions
      VisiblityParticipationCertificate
      VisibilityPerformanceCertificate
    }
  }
`;
