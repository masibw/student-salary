import {
  Text,
  Center,
  Box,
  HStack,
  VStack,
  Wrap,
  SimpleGrid,
} from "@chakra-ui/react";
import React from "react";
import { GetBlogQuery } from "../../src/generated/graphql";
import { ContributeButton } from "../../component/contributeButton";
import { useRouter } from "next/router";
import { ShareButton } from "../../component/shareButton";
import { SEO } from "../../component/seo";
import Link from "next/link";

export async function getStaticPaths() {
  let results = await fetch(
    "https://student-salary-api.an.r.appspot.com/query",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query: `query{
        blog(company_name: "all") {
          nameList
        }
      }`,
      }),
    }
  );
  const json = await results.json();
  const paths = json.data.blog.nameList.map((item) => ({
    params: { name: item },
  }));
  paths.push({ params: { name: "all" } });
  return {
    paths: paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const company_name = params.name;
  let results = await fetch(
    "https://student-salary-api.an.r.appspot.com/query",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query{
        blog(company_name: "${company_name}") {
          blog {
            title
            company_name
            url
            season
            year
          }
          nameList
        }
      }`,
      }),
    }
  );
  const data = await results.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { data, company_name }, // will be passed to the page component as props
  };
}

export default function BlogPage({ data, company_name }) {
  return (
    <>
      <SEO
        title={`${
          company_name == "all" ? "エンジニア" : company_name
        }のインターン参加ブログまとめ`}
        description={`${
          company_name == "all" ? "エンジニア" : company_name
        }のインターンブログをまとめて掲載しています。`}
        imageText={`${
          company_name == "all" ? "エンジニア" : company_name
        }のインターン参加ブログまとめ`}
      />
      <Box maxW="100vw" margin="auto" px={{ base: "2", md: "12" }}>
        <Box borderBottom="1px" borderColor="gray.400" pt="12" mb="2">
          <Text as="h1" fontSize={{ base: "5xl", md: "6xl" }} fontWeight="600">
            {company_name == "all" ? "エンジニア" : company_name}
            <br />
          </Text>
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="500">
            インターンブログまとめ。
          </Text>
        </Box>
        <Text fontSize="18">
          {company_name}
          のインターンに参加した学生のブログのリンクを掲載しています。
          <br />
          リンクをクリックすると外部サイトに飛びます。
        </Text>
        <BlogView data={data.data} name={company_name} />
      </Box>
    </>
  );
}

interface blog {
  title: string;
  company_name: string;
  year: string;
  season: string;
  url: string;
}

const BlogView = (props: { data: GetBlogQuery; name: string }) => {
  const data = props.data;
  const name = props.name;
  const router = useRouter();

  return (
    <>
      <Wrap mt="4">
        <LinkBox title="all" url={`/blog/all`} />
        {data.blog.nameList.map((item) => {
          return (
            <>
              <LinkBox
                key={item}
                title={item}
                url={`/blog/${item}`}
                select={item == name}
              />
            </>
          );
        })}
      </Wrap>
      <Box py="4"></Box>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 0, md: 2 }}>
        {data.blog.blog.map((item, index) => {
          return <BlogItemBlock key={index} item={item} />;
        })}
      </SimpleGrid>

      <Text pt="12" fontSize="18" fontWeight="bold" align="center">
        Blog情報の提供はこちらからお願いします
      </Text>
      <Center py="8">
        <ContributeButton link={"https://forms.gle/dNwsVNqqq4MCsY6q6"} />
      </Center>

      <ShareButton
        url={"https://www.student-salary.com" + router.asPath}
        title={`${name}のインターン参加ブログまとめ`}
      />
    </>
  );
};

const LinkBox = (props: { title: string; url: string; select?: boolean }) => {
  let border = "1px";
  let bg = "white";
  let color = "blue.400";
  if (props.select != undefined && props.select) {
    bg = "white";
    border = "1px";
    color = "black";
  }
  return (
    <Link href={props.url}>
      <a>
        <Text color={color}>{props.title}</Text>
      </a>
    </Link>
  );
};

export const BlogItemBlock = (props: { item: blog }) => {
  return (
    <HStack align={"center"} py="2" borderBottom="1px" borderColor="gray.400">
      <VStack align={"start"}>
        <a href={props.item.url} target="_blank" rel="noopener noreferrer">
          <Text color="blue.400" fontWeight={400}>
            {props.item.title}
          </Text>
        </a>
        <Text fontSize="14" color={"gray.600"} as="span">
          {props.item.company_name} - {props.item.year} - {props.item.season}
        </Text>
      </VStack>
    </HStack>
  );
};
