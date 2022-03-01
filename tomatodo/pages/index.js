import { useRouter } from "next/router";
import client, {
  getClient,
  usePreviewSubscription,
} from "../lib/sanity";
import React, { useState } from 'react';
import styles from '../styles/Home.module.scss';

import { groq } from "next-sanity";
import SavedTomatoes from '../components/SavedTomatoes';
import ActiveLists from "../components/ActiveLists";
import SavedLists from "../components/SavedLists";

export default function Post(props) {
	const [open, setOpen] = useState(0); 
  const { postdata, preview } = props;

  const router = useRouter();

  const { data: posts } = usePreviewSubscription(query, {
    initialData: postdata,
    enabled: preview || router.query.preview !== undefined,
  });
  return (
    <div className={styles.wrapper}>
		<SavedTomatoes tomatoes={posts.tomatoLibrary} page={'home'} />
	 	<SavedLists lista={posts.savedLists} page={'home'} />
     	<ActiveLists lista={posts.currentLists}  page={'home'} />
    </div>
  );
}

const query = groq`
{"savedLists": *[ _type == "todoList" && saved || _type == "library" ] {title, list, ..., "numberOfTodos": count(list)},
"currentLists": * [_type == "todoList" && !saved] {title, list, ...,
	"numberOfChecked": count(list[checked == true]),
	"numberOfNotChecked": count(list[checked == false]),
	"TotalNumberOfTodos": count(list)},
"tomatoLibrary": * [_type == "tomato"] {title, time}
}
`;

export async function getStaticProps({ params, preview = false }) {
  const post = await getClient(preview).fetch(query);

  return {
    props: {
      postdata: post,
      preview,
    },
    //revalidate: 10,
  };
}