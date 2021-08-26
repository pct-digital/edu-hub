import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC } from "react";

import { Page } from "../components/Page";
import { Table, TableCell, TableRow } from "../components/table/Table";
import { useAuthedQuery } from "../hooks/authedQuery";
import { Programs } from "../queries/__generated__/Programs";
import { PROGRAMS } from "../queries/programs";

export const getStaticProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      "common",
      "course-page",
      "course-application",
    ])),
  },
});

const ProgramsPage: FC = () => {
  const { data, loading, error } = useAuthedQuery<Programs>(PROGRAMS, {
    context: {
      headers: {
        "x-hasura-role": "admin",
      },
    },
  });

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <>
          <table>
            <tr>
              <td>Veröff.</td>
              <td>Programmtitel</td>
              <td>Kurztitel</td>
              <td>Start</td>
              <td>Ende</td>
              <td>Bew. Start</td>
              <td>Bew. Ende</td>
              <td>Abgabefrist</td>
              <td />
            </tr>
          </table>
          <Table>
            {data?.Program?.map((program) => (
              <TableRow
                key={program.Id}
                details={
                  <div>
                    <div>{program.QuestionnaireStart}</div>
                    <div>{program.QuestionnaireEnd}</div>
                    <div>{program.QuestionnaireSpeaker}</div>
                    <div>
                      {program.FileNameTemplateParticipationCertificate}
                    </div>
                    <div>{program.FileNameTemplatePerformanceCertificate}</div>
                    <div>
                      {program.FileLinkTemplateParticipationCertificate}
                    </div>
                    <div>{program.FileLinkTemplatePerformanceCertificate}</div>
                    <div>{program.MaxMissedSessions}</div>
                    <div>{program.VisiblityParticipationCertificate}</div>
                    <div>{program.VisibilityPerformanceCertificate}</div>
                  </div>
                }
              >
                <TableCell>{program.Visibility}</TableCell>
                <TableCell>{program.Name}</TableCell>
                <TableCell>{program.ShortName}</TableCell>
                <TableCell>{program.Start}</TableCell>
                <TableCell>{program.End}</TableCell>
                <TableCell>{program.ApplicationStart}</TableCell>
                <TableCell>{program.ApplicationEnd}</TableCell>
                <TableCell>{program.PerformanceRecordDeadline}</TableCell>
                <TableCell>löschen</TableCell>
              </TableRow>
            ))}
          </Table>
        </>
      </Page>
    </div>
  );
};

export default ProgramsPage;
