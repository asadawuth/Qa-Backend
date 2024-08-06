// title-controller.js
// exports.createTitle = async (req, res, next) => {
//   try {
//     const { titleMessage, poststory } = req.body; // string
//     //const userId = req.user.id * 1;
//     const titleImage = req.files.titleImage[0].path; //Array
//     const poststoryImage = req.files.poststoryImage.map((file) => file.path); //Array

//     const data = { userId: req.user.id * 1 }; // ส่งจากไอดี ที่เท่าไหร่

//     if (titleMessage) {
//       data.titleMessage = titleMessage; // destructuring
//     }

//     if (poststory || "") {
//       data.poststory = poststory; // destructuring
//     }

//     if (titleImage || "") {
//       data.titleImage = await upload(titleImage);
//     }

//     if (poststoryImage.length) {
//       const uploadedPostStoryImages = await Promise.all(
//         poststoryImage.map((path) => upload(path))
//       );
//       data.poststoryImage = uploadedPostStoryImages.join(",");
//     }

//     console.log(data);

//     await prisma.title.create({ data: data });
//     res.status(201).json({ message: "Post created" });
//   } catch (error) {
//     console.error(error); // Log the error for debugging
//     next(createError("Failed to create post", 500));
//   } finally {
//     //  finally {
//     //   await fs.unlink(req.files.titleImage[0].path);
//     //   await Promise.all(
//     //     req.files.poststoryImage.map((file) => fs.unlink(file.path))
//     //   );
//     // }
//     if (req.files.titleImage && req.files.titleImage[0]) {
//       await fs
//         .unlink(req.files.titleImage[0].path)
//         .catch((err) => console.error("Error deleting titleImage:", err));
//     }
//     if (req.files.poststoryImage && req.files.poststoryImage.length > 0) {
//       await Promise.all(
//         req.files.poststoryImage.map((file) =>
//           fs
//             .unlink(file.path)
//             .catch((err) =>
//               console.error("Error deleting poststoryImage:", err)
//             )
//         )
//       );
//     }
//   }
// };
////////////////////////////////////////////////////////////////////////////////////
/*
exports.like = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params); // เป็นเลข
    if (error) {
      return next(error);
    } // พัง

    const { titleId } = value; // destructuring ได้ออกมาจะเป้น 1 2 3 4 ตามลำดับของ title id
    const userId = req.user.id;

    const exisPost = await prisma.title.findUnique({
      where: {
        id: value.titleId,
      },
    });

    if (!exisPost) {
      return next(createError("post does not exist", 400));
    }

    const exisLike = await prisma.titleLike.findFirst({
      where: {
        userId: userId,
        titleId: titleId,
      },
    });
    // หาตาราง titleLike
    // ที่มี userId // id ที่เท่าไหร่ก็ว่ากันไป
    // ที่มี titleId // ที่เท่าไหร่ก็ว่ากันไป

    if (!exisLike) {
      // ถ้ายังไม่มีการกดไลท์
      await prisma.titleLike.create({
        data: {
          userId: userId,
          titleId: titleId,
        },
      });
      // ศร้างที่ตาราง titleLike id เป็น Auto เลข 1 2 3  ตามลำดับ
      // userId ที่ใช้ titleId โพสที่เท่าไหร่
      //
      await prisma.title.update({
        data: {
          totalLike: {
            increment: 1, // เพิ่มในตาราง title.totalLike += 1
          },
        },
        where: {
          id: titleId,
        },
      });
      return res.status(200).json({ message: "liked" });
    }

    // ถ้ามีอยู่แล้ว ลบ ออกจากตาราง titleLike
    await prisma.titleLike.delete({
      where: {
        id: exisLike.id,
      },
    });

    await prisma.title.update({
      data: {
        totalLike: {
          decrement: 1, // เพิ่มในตาราง title.totalLike -= 1
        },
      },
      where: {
        id: titleId,
      },
    });
    res.status(200).json({ message: "unliked" });
  } catch (err) {
    next(err);
  }
};
///////////////////////////////////////////////////////////////////////////
exports.dislike = async (req, res, next) => {
  try {
    const { value, error } = checkTitleSchema.validate(req.params);
    if (error) {
      return next(error);
    }

    const { titleId } = value;
    const userId = req.user.id;

    const exisPost = await prisma.title.findUnique({
      where: {
        id: value.titleId,
      },
    });

    if (!exisPost) {
      return next(createError("post does not exist", 400));
    }

    const exisDislike = await prisma.titleDislike.findFirst({
      where: {
        userId: userId,
        titleId: titleId,
      },
    });

    if (!exisDislike) {
      await prisma.titleDislike.create({
        data: {
          userId: userId,
          titleId: titleId,
        },
      });

      await prisma.title.update({
        data: {
          totalDislike: {
            increment: 1,
          },
        },
        where: {
          id: titleId,
        },
      });
      return res.status(200).json({ message: "disliked" });
    }

    await prisma.titleDislike.delete({
      where: {
        id: exisDislike.id,
      },
    });

    await prisma.title.update({
      data: {
        totalDislike: {
          decrement: 1,
        },
      },
      where: {
        id: titleId,
      },
    });
    res.status(200).json({ message: "undisliked" });
  } catch (error) {
    next(error);
  }
};
*/
/////////////////////////////////////////////////////////////////////////////
// exports.editTitle = async (req, res, next) => {
//   try {
//     const { value, error } = checkTitleSchema.validate(req.params);
//     if (error) {
//       return next(error);
//     }

//     const { titleId } = value;
//     const { titleMessage } = req.body;
//     const userId = req.user.id;

//     console.log(`idเลขของtitle ${titleId} เลขไอดีที่โพส : ${userId}`);

//     const existingTitle = await prisma.title.findFirst({
//       where: {
//         id: titleId,
//         userId: userId,
//       },
//     }); // หาตามนี้เลย id เลขของ title ${titleId} เลขไอดีที่ โพส : ${userId}

//     if (!existingTitle) {
//       return next(createError("Can not update Title", 400));
//     }

//     const data = {};

//     if (titleMessage) {
//       data.titleMessage = titleMessage;
//     } // ข้อความ data.titleMessage = ตัวที่ส่งมา

//     if (req.files.titleImage && req.files.titleImage[0]) {
//       const titleImagePath = req.files.titleImage[0].path;
//       data.titleImage = await upload(titleImagePath);
//     } //มีปล่าวมีก็อัพโหลด รูป แบบ 1 รูป

//     // Update the title in the database
//     // const updatedTitle =
//     const EditTitle = await prisma.title.update({
//       where: {
//         id: titleId,
//       },
//       // data,
//       // include: {
//       //   titleLikes: {
//       //     select: {
//       //       userId: true,
//       //     },
//       //   },
//       //   titleDisLikes: {
//       //     select: {
//       //       userId: true,
//       //     },
//       //   },
//       // },
//     });

//     res.status(200).json({ message: "Title updated successfully" });
//     console.log(EditTitle);
//   } catch (err) {
//     next(err);
//   } finally {
//     if (req.files.titleImage && req.files.titleImage[0]) {
//       await fs
//         .unlink(req.files.titleImage[0].path)
//         .catch((err) => console.error("Error deleting titleImage:", err));
//     }
//   }
// };
//////////////////////////////////////////////////////////////////////
// const handleEditTitle = async (e) => {
//   e.preventDefault();
//   try {
//     const formdata = new FormData();
//     if (titleMessageInput.titleMessage) {
//       formdata.append("titleMessage", titleMessageInput.titleMessage);
//     }
//     if (file) {
//       formdata.append("titleImage", file);
//     }
//     setLoading(true);
//     await editTitle(titleId, formdata);
//     setAllTitle([allTitle]);
//     window.location.reload(true);
//     onClose();
//   } catch (error) {
//     console.log(error);
//   } finally {
//     setLoading(false);
//   }
// };
///////////////////////////////////////////////////////////////////
// import { useState, useRef, useEffect } from "react";
// import LoadingWeb from "../component/LoadingWeb";
// import axios from "../config/axios";

// export default function UpdaAllTitle({
//   titletext,
//   storytext,
//   titleImage,
//   storyImage,
//   numId,
//   onsuccess,
//   //setAllDataTitleId,
// }) {
//   // 4 ตัวนี้คือ Prop ที่ส่งมาจาก CommentTitle.jsx
//   const [loading, setLoading] = useState(false);
//   const [titleInputAndStorytest, setTitleInputAndStorytest] = useState({
//     titlePost: "",
//     storyTest: "",
//   });
//   //console.log(titleInputAndStorytest);
//   const [file, setFile] = useState(null);
//   const [fileComment, setFileComment] = useState([]);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const inputEl = useRef(null);
//   const inputImages = useRef([]); // ไม่มี

//   //console.log(numId, titletext, storytext, titleImage, storyImage);

//   useEffect(() => {
//     // Directly use storyImage URLs if they're valid URLs
//     if (storyImage) {
//       setFileComment(storyImage.split(",").map((url) => url.trim())); //  ทำเป็น Array ก่อน ถึงจะ Map ได้
//     }
//   }, [storyImage]);

//   const handleSubmitForm = async (e) => {
//     e.preventDefault();
//     try {
//       const formdata = new FormData();
//       if (file) {
//         formdata.append("titleImage", file);
//       }
//       if (selectedFiles) {
//         selectedFiles.forEach((file) => {
//           formdata.append("poststoryImage", file);
//         });
//       }
//       if (titleInputAndStorytest) {
//         formdata.append("titleMessage", titleInputAndStorytest.titlePost);
//         formdata.append("poststory", titleInputAndStorytest.storyTest);
//       }

//       setLoading(true);

//       const updatedTitle = await axios.patch(
//         `/title/editalltitle/${numId}`,
//         formdata
//       );
//       // {
//       //   headers: {
//       //     "Content-Type": "multipart/form-data",
//       //   },
//       // }

//       setAllTitle((prevTitles) =>
//         prevTitles.map((title) =>
//           title.id === numId ? { ...updatedTitle } : title
//         )
//       );

//       return onsuccess();
//     } catch (error) {
//       console.error("Error editing title:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectfile = (event) => {
//     const files = Array.from(event.target.files);
//     console.log(event.target.files);
//     if (files.every((file) => file instanceof File)) {
//       setSelectedFiles(files);
//       const newImages = files.map((file) => URL.createObjectURL(file));
//       setFileComment(newImages);
//     }
//   };

//   const titleAndStoryText = (e) => {
//     setTitleInputAndStorytest({
//       ...titleInputAndStorytest,
//       [e.target.name]: e.target.value,
//     });
//   };

//   return (
//     <>
//       {" "}
//       {loading && <LoadingWeb />}
//       <form
//         className="flex justify-center flex-col p-1 h-[75vh]"
//         onSubmit={handleSubmitForm}
//       >
//         <div className="flex flex-col w-full gap-2 overflow-y-auto">
//           <div className="h-2vh flex flex-col justify-center">
//             <img
//               src={
//                 file
//                   ? URL.createObjectURL(file)
//                   : titleImage || "/src/assets/Addpic.jpg"
//               }
//               //alt="titlepost"
//               className="object-fill h-[24vh] cursor-pointer pr-20 pl-20"
//               onClick={() => inputEl.current.click()}
//             />
//             {inputEl && (
//               <input
//                 type="file"
//                 ref={inputEl}
//                 className="hidden"
//                 onChange={(e) => {
//                   if (e.target.files[0]) {
//                     setFile(e.target.files[0]);
//                   }
//                 }}
//               />
//             )}
//             {file && (
//               <div className="flex justify-center pt-3">
//                 <button
//                   type="button"
//                   className="bg-slate-200 text-2xl hover:bg-slate-300 rounded-lg font-bold px-3 py-2 mb-2"
//                   onClick={() => {
//                     inputEl.current.value = "";
//                     setFile(null);
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             )}
//             <CreateImage />
//           </div>
//           <div className="p-2">
//             <textarea
//               rows="2"
//               className="border-3 rounded-lg border-black w-full px-4 text-xl"
//               name="titlePost"
//               onChange={titleAndStoryText}
//               value={titleInputAndStorytest.titlePost}
//               placeholder={titletext}
//             />
//             <CreateTitle />
//             <textarea
//               rows="10"
//               className="border-3 rounded-lg border-black w-full px-4 text-xl"
//               name="storyTest"
//               onChange={titleAndStoryText}
//               value={titleInputAndStorytest.storyTest}
//               placeholder={storytext}
//             />

//             <CreateStory />
//             <div className="flex flex-wrap justify-center gap-1">
//               <label htmlFor="images" className="w-full flex justify-center">
//                 <img
//                   src={"/src/assets/Addpic.jpg"}
//                   className="object-fill w-[16vh] h-[16vh] cursor-pointer"
//                   onClick={() => inputImages.current[0].click()}
//                 />
//                 <input
//                   ref={(el) => (inputImages.current[0] = el)}
//                   className="hidden"
//                   name="images"
//                   type="file"
//                   multiple
//                   onChange={(e) => selectfile(e)}
//                   accept="image/png, image/jpeg, image/webp"
//                 />
//               </label>
//               {fileComment.map((image, index) => (
//                 <div key={index} className="flex flex-wrap flex-col">
//                   <img src={image} className="w-[25vh] h-[25vh]" />
//                   <button
//                     type="button"
//                     className="bg-slate-100 hover:bg-slate-300 mx-12"
//                     onClick={() =>
//                       setFileComment(fileComment.filter((_, i) => i !== index))
//                     }
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               ))}

//               {!inputImages.current[0] &&
//                 storyImage &&
//                 storyImage
//                   .split(",")
//                   .map((imageUrl, index) => (
//                     <img
//                       key={index}
//                       src={imageUrl}
//                       className="w-full rounded-2xl"
//                       alt={`Poststory Image ${index}`}
//                     />
//                   ))}
//             </div>
//             <CreateImageStory />
//           </div>
//         </div>
//         <CreateTitleButton />
//       </form>
//     </>
//   );
// }

// export function CreateImage() {
//   return (
//     <div className="text-center text-xl font-semibold pt-3">
//       Click image for Create title image
//     </div>
//   );
// }

// export function CreateTitle() {
//   return (
//     <div className="text-center text-xl font-semibold py-2">Create title</div>
//   );
// }

// export function CreateStory() {
//   return (
//     <div className="text-center font-semibold text-xl">
//       Create text your story
//     </div>
//   );
// }

// export function CreateImageStory() {
//   return (
//     <div className="text-center font-semibold text-xl">
//       Create image your story
//     </div>
//   );
// }

// export function CreateTitleButton() {
//   return (
//     <div className="flex justify-center">
//       <button
//         type="submit"
//         className="bg-slate-200 text-2xl hover:bg-slate-300 rounded-lg font-bold px-3 py-2 mb-2"
//       >
//         Post
//       </button>
//     </div>
//   );
// }
////////////////////////////////

// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import axios from "../config/axios";
// import LoadingWeb from "../component/LoadingWeb";
// import { AiFillDislike, AiFillLike } from "react-icons/ai";
// import { useAuth } from "../hook/use-auth";
// import Avatar from "../avatar/Avatar";
// import CreateCommentButton from "./CreateCommentButton";
// import EditAllDataTitleButton from "../title/EditAllDataTitleButton";

// export default function CommentTitle() {
//   const [allDataTitleId, setAllDataTitleId] = useState({
//     titleMessage: "",
//   });
//   const [likes, setLikes] = useState([]);
//   const [dislikes, setDislikes] = useState([]);
//   const [totalLike, setTotalLike] = useState(0);
//   const [totalDislike, setTotalDisLike] = useState(0);
//   const [webname, setWebname] = useState("");
//   const [imageUserCreate, setImageUserCreate] = useState("");
//   const [error, setError] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const { titleId } = useParams();
//   const { authUser } = useAuth();

//   useEffect(() => {
//     setLoading(true);
//     axios
//       .get(`/title/alldata/${titleId}`)
//       .then((res) => {
//         setAllDataTitleId(res.data);
//         setLikes(res.data.titleLikes || []);
//         setDislikes(res.data.titleDisLikes || []);
//         setTotalLike(res.data.totalLike || 0);
//         setTotalDisLike(res.data.totalDislike || 0);
//         setWebname(res.data.user.nameWebsite);
//         setImageUserCreate(res.data.user.profileWebsite);
//         setError(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError(true);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, [titleId, setAllDataTitleId]);

//   const updatedTitle = async (data) => {
//     try {
//       const res = await axios.patch(
//         `/title/editalltitle/${allDataTitleId.id}`,
//         data
//       );

//       const newData = res.data.title;
//       setAllDataTitleId(newData);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const liked = likes.find((el) => el.userId === authUser.id);
//   const disliked = dislikes.find((el) => el.userId === authUser.id);

//   const handleClickLike = async () => {
//     try {
//       await axios.post(`/title/${titleId}/like`);
//       setLikes((prevLikes) => {
//         const updatedLikes = liked
//           ? prevLikes.filter((el) => el.userId !== authUser.id) // { userId : 1 },{ userId : 2 }
//           : [...prevLikes, { userId: authUser.id }];
//         setTotalLike(liked ? totalLike - 1 : totalLike + 1);
//         return updatedLikes;
//       });
//       if (disliked) {
//         setDislikes((prevDislikes) => {
//           setTotalDisLike(totalDislike - 1);
//           return prevDislikes.filter((el) => el.userId !== authUser.id);
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleClickDisLike = async () => {
//     try {
//       await axios.post(`/title/${titleId}/dislike`);
//       setDislikes((prevDislikes) => {
//         const updatedDislikes = disliked
//           ? prevDislikes.filter((el) => el.userId !== authUser.id)
//           : [...prevDislikes, { userId: authUser.id }];
//         setTotalDisLike(disliked ? totalDislike - 1 : totalDislike + 1);
//         return updatedDislikes;
//       });
//       if (liked) {
//         setLikes((prevLikes) => {
//           setTotalLike(totalLike - 1);
//           return prevLikes.filter((el) => el.userId !== authUser.id);
//         });
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   if (error) {
//     return (
//       <div className="h-[100vh] flex justify-center items-center">
//         <div>
//           <h1 className={`text-white text-[11rem] animate-pulse`}>
//             404 TITLE NOT FOUND
//           </h1>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {loading && <LoadingWeb />}
//       <CreateCommentButton />
//       <div className="h-[100vh] overflow-y-auto text-white px-[40rem]">
//         <div className="border-white border-2 mt-4 mb-4 rounded-md px-4">
//           <div className="flex flex-col gap-4 pt-2 ">
//             <div className="text-4xl">{allDataTitleId.titleMessage || "z"}</div>
//             <div className="flex gap-2">
//               <div>
//                 <Link to={`/userdata/${allDataTitleId.userId}`}>
//                   <Avatar src={imageUserCreate} />
//                 </Link>
//               </div>
//               <div className="flex flex-col">
//                 <div className="text-base">
//                   <div>{webname}</div>
//                 </div>
//                 <div>
//                   <div>
//                     {new Date(allDataTitleId?.createdAt).toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div
//               className={`w-full ${!allDataTitleId.titleImage ? "hidden" : ""}`}
//             >
//               <img
//                 src={allDataTitleId.titleImage}
//                 className="w-full rounded-2xl"
//               />
//             </div>
//             <div>
//               <hr
//                 className={`border-white border-3 opacity-80 ${
//                   !allDataTitleId.titleImage ? "hidden" : ""
//                 }`}
//               />
//             </div>

//             <div className="text-sm">{allDataTitleId.poststory}</div>
//             <div
//               className={`${
//                 !allDataTitleId.poststoryImage
//                   ? "hidden"
//                   : "w-full flex flex-col gap-4 "
//               }`}
//             >
//               {allDataTitleId.poststoryImage ? (
//                 allDataTitleId.poststoryImage
//                   .split(",")
//                   .map((imageUrl, index) => (
//                     <img
//                       key={index}
//                       src={imageUrl}
//                       className="w-full rounded-2xl"
//                       alt={`Poststory Image ${index}`}
//                     />
//                   ))
//               ) : (
//                 <img className="hidden" />
//               )}
//             </div>

//             <hr
//               className={`border-white border-3 opacity-80 ${
//                 !allDataTitleId.poststoryImage ? "hidden" : "pb-8"
//               }`}
//             />
//             <div
//               className={`text-2xl pb-2 flex ${
//                 authUser.id !== allDataTitleId.userId ? "" : "justify-evenly "
//               }`}
//             >
//               <div className="flex gap-4">
//                 <div className="flex gap-2">
//                   <AiFillLike
//                     className={`cursor-pointer ${
//                       liked ? "text-amber-500" : ""
//                     }`}
//                     onClick={handleClickLike}
//                   />
//                   <span>{totalLike}</span>
//                 </div>
//                 <div className="flex gap-2">
//                   <AiFillDislike
//                     className={`cursor-pointer ${
//                       disliked ? "text-amber-500" : ""
//                     }`}
//                     onClick={handleClickDisLike}
//                   />
//                   <span>{totalDislike}</span>
//                 </div>
//               </div>

//               {authUser.id === allDataTitleId.userId && (
//                 <>
//                   <EditAllDataTitleButton
//                     titletext={allDataTitleId.titleMessage}
//                     storytext={allDataTitleId.poststory}
//                     titleImage={allDataTitleId.titleImage}
//                     storyImage={allDataTitleId.poststoryImage}
//                     updatedTitle={updatedTitle}
//                   />
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// model commentTitle {
//   id              Int              @id @default(autoincrement()) //PK
//   message         String?          @db.Text
//   commentImage    String?          @db.Text
//   createdAt       DateTime         @default(now())
//   totalLike       Int              @default(0)
//   totalDislike    Int              @default(0)
//   userId          Int
//   user            User             @relation(fields: [userId], references: [id]) //FK  id user ที่มา comment
//   titleId         Int?
//   Title           Title?           @relation(fields: [titleId], references: [id]) //FK
//   commentLikes    commentLike[]
//   commentDislikes commentDislike[]
// }

// model commentLike {
//   id             Int           @id @default(autoincrement()) //PK
//   userId         Int
//   user           User          @relation(fields: [userId], references: [id])
//   titleId        Int
//   title          Title         @relation(fields: [titleId], references: [id])
//   commentTitle   commentTitle? @relation(fields: [commentTitleId], references: [id])
//   commentTitleId Int?
// }

// model commentDislike {
//   id             Int           @id @default(autoincrement()) //PK
//   userId         Int
//   user           User          @relation(fields: [userId], references: [id]) //Fk
//   titleId        Int
//   title          Title         @relation(fields: [titleId], references: [id]) //Fk
//   commentTitle   commentTitle? @relation(fields: [commentTitleId], references: [id])
//   commentTitleId Int?
// }
