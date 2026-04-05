# SentinelAI Sample Data

This folder generates local test inputs for every detection route and then sends them to the running backend to collect real results.

## What it includes

- `generate_samples.py` creates deterministic sample inputs in `inputs/`.
- `run_checks.py` posts those inputs to the API and writes real analysis results to `results/analysis_results.json`.
- `inputs/` holds the generated files for image, text, audio, and video testing.
- `results/` holds the latest backend responses, including `is_fake_probability` and `is_real_probability`.

## How to use

1. Start the backend on `http://localhost:8000`.
2. From this folder, run:

   `python generate_samples.py`

3. Then run:

   `python run_checks.py`

4. Open `results/analysis_results.json` to see the exact percentages returned by the API.

## Interpretation

- For image, audio, and video, `yes` means fake/manipulated probability and `no` means authentic probability.
- For text, `yes` means AI-generated probability and `no` means human-written probability.

## Notes

- The generated inputs are deterministic so the same files are reused each time.
- The results come from the live backend; they are not prefilled or guessed.