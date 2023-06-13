import docx
from bs4 import BeautifulSoup

def convert_to_html(file_path):
    doc = docx.Document(file_path)
    html_content = ""
    
    for element in doc.element.body:
        html_content += element.xml
    
    soup = BeautifulSoup(html_content, "lxml")
    return str(soup)

# Example usage
# word_file = "./Test.docx"
word_file = r"C:\Users\Rostan\Documents\Startup\MVP 0v3\Client\src\Test.docx"

html_content = convert_to_html(word_file)


import pypandoc
def convert_to_markdown(html_content):
    markdown_content = pypandoc.convert_text(html_content, "md", format="html")
    return markdown_content

# Example usage
pypandoc.download_pandoc()
markdown_content = convert_to_markdown(html_content)



def save_to_md(markdown_content, output_file):
    with open(output_file, "w") as file:
        file.write(markdown_content)

# Example usage
output_md_file = r"C:\Users\Rostan\Documents\Startup\MVP 0v3\Client\src\Test.md"
save_to_md(markdown_content, output_md_file)
