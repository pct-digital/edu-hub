import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { FC } from "react";

import { Page } from "../components/Page";
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
            {data?.Program?.map((program) => (
              <tr key={program.Id}>
                <td>{program.Visibility}</td>
                <td>{program.Name}</td>
                <td>TODO: program.shortName is missing</td>
                <td>{program.Start}</td>
                <td>{program.End}</td>
                <td>{program.ApplicationStart}</td>
                <td>{program.ApplicationEnd}</td>
                <td>{program.PerformanceRecordDeadline}</td>
                <td>löschen</td>
              </tr>
            ))}
          </table>
        </>
      </Page>
    </div>
  );
};

export default ProgramsPage;
