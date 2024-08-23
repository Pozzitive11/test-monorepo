import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DocumentViewerService {
    private authToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJBZG1pbiIsInBhc3N3b3JkIjoiJDJiJDEyJE5ZYUNzbFUubC5YeWxueC9aNzU3VS5RNkdUa1lYd2hSbEp6ZjZSWFFzdjRIcXhRUWYxWS5DIiwicm9sZSI6ImFkbWluIiwiZXhwaXJlX2F0IjoiMjAyNC0wOC0yMFQwNzowMjo0NS41NzU4OTAifQ.DQ8l4qgsUV31l_swilghwgCx7R4B4oNib6YvqHyKR3U'; 
  
    openDocumentInNewTab(documentType: string, docTextId: string): void {
        const endpointUrl = `http://dev.data-factory.ua/open-court-fin/api/v0/OpenCourt/get_documents_text/${docTextId}`;
      
        fetch(endpointUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.authToken}`,
            'Content-Type': 'application/json',
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            let documentText = data.text;
      
            // Добавление стилей к содержимому документа
            const styles = `
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f0f0f0;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                }
                .document-wrapper {
                  background-color: #fff;
                  padding: 40px;
                  border-radius: 10px;
                  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                  width: 80%;
                  max-width: 800px;
                  margin: auto;
                  overflow-y: auto;
                  height: calc(100vh - 80px);
                }
                h1, h2, h3 {
                  text-align: center;
                }
                p {
                  text-align: justify;
                  line-height: 1.6;
                  margin: 10px 0;
                }
                .document-header, .document-footer {
                  text-align: center;
                  margin-bottom: 30px;
                }
              </style>
            `;
            documentText = `
              <!DOCTYPE html>
              <html lang="uk">
              <head>
                <meta charset="UTF-8">
                <title>${documentType}</title>
                ${styles}
              </head>
              <body>
                <div class="document-wrapper">
                  ${documentText}
                </div>
              </body>
              </html>
            `;
      
            const blob = new Blob([documentText], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
      
            const newWindow = window.open(url, '_blank');
            if (newWindow) {
              newWindow.document.close();
            }
          })
          .catch(error => {
            console.error('Error fetching document text:', error);
          });
      }
    }
