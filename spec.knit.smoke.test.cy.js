describe('Smoke Test KNIT', () => {

  const users = [
    { role: 'SUPER ADMIN', email: 'willian_qa@opemcode.com', senha: '12345678**' },
    { role: 'ADMIN', email: 'jake@jukes.com', senha: '12345678**' },
    { role: 'USER', email: 'pedro@alvares.com', senha: '12345678**' },
  ]

  const pages = [
    { name: 'Painel de Controle', label: 'Painel de Controle' },
    { name: 'Gestão de Fluxos', label: 'Gestão de Fluxos' },
    { name: 'GED', label: 'GED' },
    { name: 'Atividades', label: 'Atividades' },
    { name: 'Calendário', label: 'Calendário' },
    { name: 'Aprovações', label: 'Aprovações' },
    { name: 'Notificações', label: 'Notificações' },
    { name: 'Relatório Geral', label: 'Relatório Geral' },
    { name: 'Log de Agendamentos', label: 'Log de Agendamentos' },
    { name: 'Relatórios Inteligentes', label: 'Relatórios Inteligentes' },
    { name: 'Dashboards com IA', label: 'Dashboards com IA' },
    { name: 'Usuários', label: 'Usuários' },
    { name: 'Departamentos', label: 'Departamentos' },
    { name: 'NFSe', label: 'NFSe' },
    { name: 'Configurações', label: 'Configurações' },
  ]

  const accessByRole = {
    'SUPER ADMIN': pages.map(p => p.label),
    'ADMIN': pages.map(p => p.label),
    'USER': [
      'GED',
      'Atividades',
      'Calendário',
      'Aprovações',
      'Notificações',
      'Configurações'
    ]
 }

  users.forEach(user => {

    describe(`Perfil: ${user.role}`, () => {

      beforeEach(() => {
        cy.visit('https://knit-app.qa.opemcode.com')
        cy.get(':nth-child(1) > .w-full')
          .should('be.visible')
          .type(user.email)
        cy.get('.relative > .w-full')
          .should('be.visible')
          .type(user.senha)
        cy.get('.space-y-6 > .text-white').click()
        cy.url({ timeout: 10000 }).should('not.include', '/login')
        cy.get('.justify-between > :nth-child(1) > .p-2').should('be.visible')

      })
        afterEach(() => {
          cy.clearCookies()
          cy.clearLocalStorage()
        })

      pages.forEach(page => {

        it(`Validar acesso à página: ${page.name}`, () => {

          const allowedPages = accessByRole[user.role]
          const hasAccess = allowedPages.includes(page.label)

        cy.get('.justify-between > :nth-child(1) > .p-2')
          .should('be.visible')
          .click()

          if (hasAccess) {
            cy.get('nav', { timeout: 10000 })
             .contains(page.label)
             .scrollIntoView()
             .should('be.visible')
             .click()

            cy.get('body').should('be.visible')
            cy.get('body').should('not.contain', 'Error')
            cy.get('body').should('not.contain', '404')
            cy.get('body').should('not.contain', '500')

          } else {
      
            cy.get('nav')
              .contains(page.label)
              .should('not.exist')
          }
        })

      })

    })

  })

})
