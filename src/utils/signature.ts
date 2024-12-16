interface SignatureData {
  name: string;
  title?: string;
  email: string;
  phone?: string;
  logo?: string;
  primaryColor: string;
  layout: 'vertical' | 'horizontal';
}

export function generateSignatureHtml(data: SignatureData): string {
  const { name, title, email, phone, logo, primaryColor, layout } = data;

  const styles = {
    container: `font-family: Arial, sans-serif; color: #333333; ${
      layout === 'horizontal' ? 'display: flex; align-items: center;' : ''
    }`,
    logo: 'max-width: 120px; height: auto; margin-bottom: 10px;',
    name: `font-size: 16px; font-weight: bold; color: ${primaryColor}; margin: 0;`,
    title: 'font-size: 14px; color: #666666; margin: 4px 0;',
    contact: 'font-size: 14px; color: #666666; margin: 0;',
    divider: `width: ${layout === 'horizontal' ? '1px' : '100%'}; 
             height: ${layout === 'horizontal' ? '40px' : '1px'}; 
             background-color: #e5e7eb; 
             margin: ${layout === 'horizontal' ? '0 15px' : '10px 0'};`,
  };

  return `
    <div style="${styles.container}">
      ${
        logo
          ? `
        <div style="${layout === 'horizontal' ? 'margin-right: 15px;' : ''}">
          <img src="${logo}" alt="Company Logo" style="${styles.logo}" />
        </div>
      `
          : ''
      }
      
      <div>
        <p style="${styles.name}">${name}</p>
        ${title ? `<p style="${styles.title}">${title}</p>` : ''}
        <div style="${styles.divider}"></div>
        <p style="${styles.contact}">
          <a href="mailto:${email}" style="color: ${primaryColor}; text-decoration: none;">
            ${email}
          </a>
          ${
            phone
              ? `
            <br />
            <a href="tel:${phone}" style="color: ${primaryColor}; text-decoration: none;">
              ${phone}
            </a>
          `
              : ''
          }
        </p>
      </div>
    </div>
  `;
}
