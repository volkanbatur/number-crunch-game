# Contributing Guide 🤝

Thank you for your interest in contributing to Number Crunch! This guide will help you get started.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs 🐛

1. Check if the bug is already reported in our [Issues](https://github.com/volkanbatur/number-crunch-game/issues)
2. If not, create a new issue using our [Bug Report Template](https://github.com/volkanbatur/number-crunch-game/issues/new?template=bug_report.md)
3. Include as much detail as possible:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Your environment (OS, browser, etc.)

### Suggesting Enhancements ✨

1. Check if the enhancement is already suggested in our [Issues](https://github.com/volkanbatur/number-crunch-game/issues)
2. If not, create a new issue using our [Feature Request Template](https://github.com/volkanbatur/number-crunch-game/issues/new?template=feature_request.md)
3. Describe your suggestion in detail:
   - What problem does it solve?
   - How should it work?
   - Why would it be useful?

### Pull Requests 🚀

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes
4. Run tests and linting:
   ```bash
   npm run test
   npm run lint
   ```
5. Commit your changes:
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
7. Create a Pull Request

## Development Guidelines

### Commit Messages

We use conventional commits. Format: `type(scope): description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

### Code Style

- Use TypeScript
- Follow ESLint rules
- Write meaningful comments
- Add JSDoc for public functions
- Keep functions small and focused
- Use meaningful variable names

### Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Add integration tests for complex features
- Test edge cases

### Documentation

- Update README.md if needed
- Add JSDoc comments
- Update wiki pages
- Document breaking changes

## Project Structure

```
number-crunch/
├── src/
│   ├── components/    # React components
│   ├── types/        # TypeScript types
│   ├── utils/        # Utility functions
│   └── assets/       # Static assets
├── tests/            # Test files
├── docs/             # Documentation
└── wiki/             # Wiki pages
```

## Getting Help

- Check our [Development Setup](./Development-Setup.md) guide
- Join our [Discussions](https://github.com/volkanbatur/number-crunch-game/discussions)
- Ask questions in Issues
- Read our [FAQ](./FAQ.md) 