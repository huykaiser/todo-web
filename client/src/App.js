import { useEffect, useState } from "react";
import ListHeader from "./components/ListHeader";
import ListItem from "./components/ListItem";
import Auth from "./components/Auth";
import { useCookies } from "react-cookie";

const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.Email;
  const authToken = cookies.AuthToken;
  const [tasks, setTasks] = useState(null);

  const getData = async () => {

    try {
      const response = await fetch(`http://localhost:8000/todos/${userEmail}`);
      const json = await response.json();

      // console.log("json: ", json);
      setTasks(json);
    } catch (error) {
      console.error("error: ", error);
    }
  }

  useEffect(() => {
    if(authToken){
      getData()
    }
  }, [])

  // sort by date
  const sortedTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="app">
      {!authToken && <Auth/>}
      {authToken &&
        <>
          <ListHeader listName="TO DO LIST" getData={getData} />
          <p className="user-email">Welcome back {userEmail}</p>
          {sortedTasks?.map((task) => <ListItem key={task.id} task={task} getData={getData} />)}
        </>
      }

    </div>
  );
}

export default App;
