import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const DocumentService = {
  async createDocument(title, content) {
    try {
      const html = `
        <html>
          <head>
            <style>
              body {
                font-size: 12px;
              }
              h1 {
                font-size: 18px;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <p>${content}</p>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      return uri;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  async shareDocument(fileUri) {
    try {
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error('Error sharing document:', error);
      throw error;
    }
  },
};

export default DocumentService;