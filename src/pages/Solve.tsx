import { useEffect, useState } from "react";
import { languageOptions } from "../constants/languageOptions";
import { loader } from "@monaco-editor/react";
import axios from "axios";
import CodeEditorWindow from "../components/CodeEditorWindow";
import LanguageDropdown from "../components/LanguageDropdown";
import ThemeDropdown from "../components/ThemeDropdown";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "../components/ui/resizable";
import { useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "../components/ui/accordion";

type Language = {
  id: number;
  name: string;
  value: string;
  label: string;
  defaultCode?: string;
};

type Theme = {
  label: string;
  value: string;
  key: string;
};

const codeDefault = `console.log("Hello, World!");`;

const Solve = () => {
  const { id } = useParams<{ id: string }>();
  const [language, setLanguage] = useState<Language>(languageOptions[0]);
  const [theme, setTheme] = useState<string>("vs-dark");
  const [code, setCode] = useState<string>(codeDefault);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [questionId, setQuestionId] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [showTopics, setShowTopics] = useState<boolean>(false);

  useEffect(() => {
    const setInitialTheme = async () => {
      try {
        const themeData = await fetch(`/themes/Blackboard.json`).then((res) =>
          res.json(),
        );
        const monaco = await loader.init();
        monaco.editor.defineTheme("Select Theme", themeData);
        setTheme("Select Theme");
      } catch (error) {
        console.log("Error setting theme:", error);
      }
    };

    setInitialTheme();
  }, []);

  useEffect(() => {
    console.log("id", id);
    const fetchProblem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/problem/api/problems/${id}`,
        );
        const data = response.data;
        setQuestionId(data.question_id);
        setTitle(data.title);
        setDescription(data.description);
        setDifficulty(data.difficulty);
        setTags(data.tags);
        console.log(data);
      } catch (error) {
        console.error("Error fetching problem:", error);
      }
    };

    fetchProblem();
  }, []);

  const onSelectChange = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
    setCode(selectedLanguage.defaultCode || "");
  };

  const handleThemeChange = async (selectedTheme: Theme) => {
    try {
      const themeData = await fetch(`/themes/${selectedTheme.label}.json`).then(
        (res) => res.json(),
      );
      const monaco = await loader.init();
      monaco.editor.defineTheme(selectedTheme.value, themeData);
      setTheme(selectedTheme.value);
    } catch (error) {
      console.error("Error setting theme:", error);
    }
  };

  // const checkStatus = async (token: string) => {
  //   // We will come to the implementation later in the code
  //   console.log("Checking status...");
  //   const options = {
  //     method: "GET",
  //     url: "https://judge0-ce.p.rapidapi.com/submissions" + "/" + token,
  //     params: { base64_encoded: "true", fields: "*" },
  //     headers: {
  //       "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  //       "X-RapidAPI-Key": "a6e9189d6amshea6c01c5706eee7p139652jsn6a7ac716f5f1",
  //     },
  //   };
  //   try {
  //     const response = await axios.request(options);
  //     console.log("res.data", response.data);
  //     const status = response.data.status.id;
  //     if (status < 2) {
  //       setTimeout(() => {
  //         checkStatus(token);
  //       }, 2000);
  //     } else {
  //       setProcessing(false);
  //       setOutputDetails(response.data);
  //     }
  //   } catch (err: any) {
  //     let error = err.response ? err.response.data : err;
  //     setProcessing(false);
  //     console.log(error);
  //   }
  // };

  const onChange = (action: any, data: any) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  // const handleCompile = async () => {
  //   setProcessing(true);
  //   const formData = {
  //     language_id: language.id,
  //     source_code: btoa(code),
  //     stdin: btoa(customInput),
  //   };

  //   const options = {
  //     method: "POST",
  //     url: "https://judge0-ce.p.rapidapi.com/submissions",
  //     params: { base64_encoded: "true", fields: "*" },
  //     headers: {
  //       "content-type": "application/json",
  //       "Content-Type": "application/json",
  //       "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
  //       "X-RapidAPI-Key": "a6e9189d6amshea6c01c5706eee7p139652jsn6a7ac716f5f1",
  //     },
  //     data: formData,
  //   };

  //   try {
  //     const response = await axios.request(options);
  //     console.log("res.data", response.data);
  //     const token = response.data.token;
  //     console.log("Token", token);
  //     checkStatus(token);
  //   } catch (err: any) {
  //     let error = err.response ? err.response.data : err;
  //     setProcessing(false);
  //     console.log(error);
  //   }
  // };
  const toggleTopics = () => {
    setShowTopics(!showTopics);
  };

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[200px] rounded-lg border"
    >
      <ResizablePanel defaultSize={40}>
        <div className="min-w-96">
          <div className="flex flex-col gap-5 m-3">
            <h1 className=" text-3xl font-bold">
              {questionId}. {title}
            </h1>
            <h2 className="text-2xl font-bold">{difficulty}</h2>
            <p className="text-gray-700 text-lg">{description}</p>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <h2 className="text-2xl font-bold">Topics</h2>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-row gap-2">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="bg-slate-900 text-white px-2 py-1 rounded-lg"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={60}>
        <div className="flex flex-col">
          <div className="flex flex-row gap-5 m-3 justify-end">
            <LanguageDropdown onSelectChange={onSelectChange} />
            <ThemeDropdown
              handleThemeChange={handleThemeChange}
              theme={theme}
            />
          </div>
          <CodeEditorWindow
            onChange={onChange}
            language={language?.value}
            code={code}
            theme={theme}
            shadow-lg
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default Solve;
