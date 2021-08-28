import {
  Text,
  Center,
  Stack,
  Heading,
  Button,
  Box,
  useColorModeValue,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";

import Link from "next/link";
export const ReviewItem = (props: {
  name: String;
  detail: String;
  user_name: String;
  link: String;
}) => {
  return (
    <Link href={`${props.link}`} passHref>
      <Center py={4}>
        <Box
          bg={useColorModeValue("white", "gray.900")}
          border={"1px"}
          borderColor={"blackAlpha.200"}
          rounded={"lg"}
          p={3}
          m={1}
          w={"full"}
          h={"full"}
        >
          <Heading fontSize={"xl"} fontFamily={"body"}>
            {props.name}
          </Heading>
          <Text fontSize={"sm"} fontWeight={300} color={"gray.500"} mb={4}>
            回答者: {props.user_name}
          </Text>
          <Text>
            {props.detail}...
            <Text as={"span"} fontSize={"8"} color={"gray.600"}>
              <br />
              続きを読む
            </Text>
          </Text>
        </Box>
      </Center>
    </Link>
  );
};