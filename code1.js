// generator client {
//     provider = "prisma-client-js"
//   }

//   datasource db {
//     provider = "mysql"
//     url      = env("DATABASE_URL")
//   }

//   model User {
//     id             Int              @id @default(autoincrement()) //PK
//     nameWebsite    String           @unique
//     email          String?          @unique
//     mobile         String?          @unique
//     password       String
//     profileWebsite String?
//     User_data      User_data?
//     Titles         Title[]
//     commentTitles  commentTitle[]
//     titleLikes     TitleLike[]
//     titleDisLikes  TitleDislike[]
//     commentLike    commentLike[]
//     commentDislike commentDislike[]
//   }

//   model User_data {
//     id          Int     @id @default(autoincrement()) //PK
//     user        User    @relation(fields: [userId], references: [id])
//     userId      Int     @unique // FK
//     firstName   String?
//     lastName    String?
//     nickName    String?
//     tel         String?
//     age         String?
//     sex         String?
//     nationality String?
//     address     String?
//     pinMapGps   String?
//   }

//   model Title {
//     id             Int            @id @default(autoincrement()) //PK
//     titleMessage   String?
//     titleImage     String?
//     createdAt      DateTime       @default(now())
//     totalLike      Int            @default(0)
//     totalDislike   Int            @default(0)
//     poststory      String?        @db.Text
//     poststoryImage String?        @db.Text //แก้ปัญหาโค็ด P2000
//     userId         Int //FK
//     user           User           @relation(fields: [userId], references: [id])
//     commentTitles  commentTitle[]
//     titleLikes     TitleLike[]
//     titleDisLikes  TitleDislike[]
//   }

//   model TitleLike {
//     id      Int   @id @default(autoincrement()) //PK
//     userId  Int
//     user    User  @relation(fields: [userId], references: [id]) //Fk
//     titleId Int
//     title   Title @relation(fields: [titleId], references: [id]) //Fk
//   }

//   model TitleDislike {
//     id      Int   @id @default(autoincrement()) //PK
//     userId  Int
//     user    User  @relation(fields: [userId], references: [id]) //Fk
//     titleId Int
//     title   Title @relation(fields: [titleId], references: [id]) //Fk
//   }

//   model commentTitle {
//     id              Int              @id @default(autoincrement()) //PK
//     message         String?          @db.Text
//     commentImage    String?          @db.Text
//     createdAt       DateTime         @default(now())
//     totalLike       Int              @default(0)
//     totalDislike    Int              @default(0)
//     userId          Int
//     user            User             @relation(fields: [userId], references: [id]) //FK
//     titleId         Int?
//     Title           Title?           @relation(fields: [titleId], references: [id]) //FK
//     commentLikes    commentLike[]
//     commentDislikes commentDislike[]
//   }

//   model commentLike {
//     id             Int          @id @default(autoincrement()) //PK
//     userId         Int
//     user           User         @relation(fields: [userId], references: [id])
//     commentTitleId Int
//     commentTitle   commentTitle @relation(fields: [commentTitleId], references: [id]) // FK
//   }

//   model commentDislike {
//     id             Int          @id @default(autoincrement()) //PK
//     userId         Int
//     user           User         @relation(fields: [userId], references: [id]) //Fk
//     commentTitleId Int
//     commentTitle   commentTitle @relation(fields: [commentTitleId], references: [id]) // FK
//   }
//////////////////////////////////////////////////////////////
{
  /* <div className="flex gap-4">
              <div>
                <Link to={`/userdata/${allDataTitleId.userId}`}>
                  <Avatar src={imageUserCreate} />
                </Link>
              </div>
              <div className="flex flex-col">
                <div className="text-base">
                  <div>{webname}</div>
                </div>
                <div>
                  <div>
                    {new Date(allDataTitleId?.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div> */
}
                                       
{
  /* <div
              className={`w-full ${!allDataTitleId.titleImage ? "hidden" : ""}`}
            >
              <img
                src={allDataTitleId.titleImage}
                className="w-full rounded-2xl"
              />
            </div> */
}
{
  /* <div>
              <hr
                className={`border-white border-3 opacity-80 ${
                  !allDataTitleId.titleImage ? "hidden" : ""
                }`}
              />
            </div> */
}

{
  /* <div className="text-sm">{allDataTitleId.poststory}</div>
            <div
              className={`${
                !allDataTitleId.poststoryImage
                  ? "hidden"
                  : "w-full flex flex-col gap-4 "
              }`}
            >
              {allDataTitleId.poststoryImage ? (
                allDataTitleId.poststoryImage
                  .split(",")
                  .map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      className="w-full rounded-2xl"
                      alt={`Poststory Image ${index}`}
                    />
                  ))
              ) : (
                <img className="hidden" />
              )}
            </div> */
}

{
  /* <hr
              className={`border-white border-3 opacity-80 ${
                !allDataTitleId.poststoryImage ? "hidden" : "pb-8"
              }`}
            /> */
}

///////////////////////////////////////////////////////////////

{
  /* <div className="flex gap-4">
                <div className="flex gap-2">
                  <AiFillLike
                    className={`cursor-pointer ${
                      liked ? "text-amber-500" : ""
                    }`}
                    onClick={handleClickLike}
                  />
                  <span>{totalLike}</span>
                </div>
                <div className="flex gap-2">
                  <AiFillDislike
                    className={`cursor-pointer ${
                      disliked ? "text-amber-500" : ""
                    }`}
                    onClick={handleClickDisLike}
                  />
                  <span>{totalDislike}</span>
                </div>
              </div> */
}
