//
// console.log('hi');
// import React, { type PropsWithChildren, useState } from "react";
// import {
//   Button,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from "react-native";
// import DocumentPicker from "react-native-document-picker";
// import { RequestSendAttachment } from "../session_11_backend/src/models/messages/RequestSendAttachment"
// import { ResponseSendAttachment } from "../session_11_backend/src/models/messages/ResponseSendAttachment"
// import { DbAttachment } from "../session_11_backend/src/models/db/DbAttachment"
// import axios from "axios";
// import RNFS from 'react-native-fs';
//
// const PORT = '8000';
// const DOMAIN = '10.0.2.2';
//
// const App = () => {
//
//   const [selectedAttachments, setSelectedAttachments] = useState([]);
//   const onSelectAttachments = async () => {
//     const newAttachments = await DocumentPicker.pick();
//     setSelectedAttachments([...selectedAttachments, ...newAttachments]);
//   }
//   const onSubmit = async () => {
//     try {
//       let request = {
//         session_token: 'not implemented',
//         attachment: {
//           uuid: 'not implemented',
//           note: 'not implemented',
//           created: new Date(),
//           is_deleted: false,
//         } as DbAttachment
//       } as RequestSendAttachment;
//       const formData = new FormData();
//       formData.append("request_json", JSON.stringify(request));
//       formData.append("attachment_file", selectedAttachments[0]);
//
//       let query = await axios.post(
//         'http://10.0.2.2:8000/attachments/upload',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );
//       let response = query.data as ResponseSendAttachment;
//       console.log(response.is_success);
//
//       // let fileDownloaded = await axios.get(
//       // 	`http://${DOMAIN}:${PORT}/attachments/${selectedAttachments[0].name}`,
//       // 	{
//       // 		responseType: "blob"
//       // 	}
//       // );
//
//       let localFilePath = `${RNFS.DocumentDirectoryPath}/${selectedAttachments[0].name}`;
//       let { jobId, promise } = RNFS.downloadFile({
//         fromUrl: `http://${DOMAIN}:${PORT}/attachments/${selectedAttachments[0].name}`,
//         toFile: localFilePath
//
//       });
//       await promise;
//       let contents = await RNFS.readFile(localFilePath);
//       console.log(contents);
//
//     } catch (e) {
//       console.error(e);
//     }
//   }
//   const onCheck = async () => {
//     try {
//       await axios.get('http://share.yellowrobot.xyz/quick/2023-5-26-B1963BFB-5909-405C-82D9-D66C6EF545F0.html');
//       console.log('internet works');
//     } catch (e) {
//       console.error(e);
//     }
//   }
//
//   const onCheck2 = async () => {
//     try {
//       const test = await axios.get('http://10.0.2.2:8000/attachments/test1.txt');
//       console.log('test1 file accessed successfully');
//       console.log(test);
//     } catch (e) {
//       console.error(e);
//     }
//   }
//
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <StatusBar barStyle="dark-content" />
//       <ScrollView style={{ flex: 1, backgroundColor: "red" }} contentContainerStyle={{ flex: 1 }}>
//         <View style={styles.container}>
//           <Text style={styles.h1}>Attachment uploader</Text>
//           <Button title={'Select attachments'} onPress={onSelectAttachments} />
//           {selectedAttachments.length > 0 && (
//             <View>
//               <Text>Attachments:</Text>
//               {selectedAttachments.map(attachment => (
//                 <Text key={attachment.uri}>{attachment.name}</Text>
//               ))}
//             </View>
//           )}
//           <Button title={'Submit'} onPress={onSubmit} />
//           {/!*<Button title={'check'} onPress={onCheck} />*!/}
//           {/!*<Button title={'check'} onPress={onCheck2} />*!/}
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };
//
// export default App;
//
// const styles = StyleSheet.create({
//   h1: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
